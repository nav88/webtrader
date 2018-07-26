﻿/*
 * Created by amin on December 4, 2015.
 */

import _ from 'lodash';
import $ from 'jquery';
import moment from 'moment';
import liveapi from '../websockets/binary_websockets';
import rv from '../common/rivetsExtra';
import chartingRequestMap from '../charts/chartingRequestMap';
import html from 'text!../trade/tradeConf.html';
import 'css!../trade/tradeConf.css';
import Lookback from './lookback';

/* rv binder to show tick chart for this confirmation dialog */
rv.binders['tick-chart'] = {
   priority: 65, /* a low priority to apply last */
   bind: function(el) {
      const model = this.model;
      el.chart = new Highcharts.Chart({
         title: '',
         credits: {enabled: false},
         chart: {
            type: 'line',
            renderTo: el,
            backgroundColor: null, /* make background transparent */
            width: (el.getAttribute('width') || 400)*1,
            height: (el.getAttribute('height') || 120)*1,
         },
         tooltip: {
            formatter: function () {
               const tick = model.array[this.x-1];
               return (tick && tick.tooltip) || false;
            }
         },
         xAxis: {
            type: 'linear',
            min: 1,
            max: el.getAttribute('tick-count')*1 + 1 /* exist spot vertical plot will not be at the end */,
            labels: { enabled: false, }
         },
         yAxis: {
            labels: { align: 'left', x: 0, },
            title: '',
            gridLineWidth: 0,
         },
         series: [
            { data: [] },
            /* HighChart scales the y-axis automatically based on the maximum value of data.
             * but it doesn't consider the plotLine's value in its calculations.
             * We add an invisible seri and late plotline values to work around this issue. */
            {
               type: 'scatter',
               marker: { enabled: false },
               data: []
            }
         ],
         plotOptions: { scatter: { enableMouseTracking: false } },
         exporting: {enabled: false, enableImages: false},
         legend: {enabled: false},
      });
   },
   routine: function(el, ticks){
      const model = this.model;
      const addPlotLineX = (chart, options) => {
         const label_left_or_right = options.label === 'Entry Spot' ? -15 : 5;

         chart.xAxis[0].addPlotLine({
            value: options.value,
            id: options.id || options.value,
            label: {text: options.label || 'label', x:  label_left_or_right },
            color: options.color || '#e98024',
            width: options.width || 2,
         });
      };

      const addPlotLineY = (chart,options) => {
         chart.yAxis[0].addPlotLine({
            id: options.id || options.label,
            value: options.value,
            label: {text: options.label, align: 'center'},
            color: 'green',
            width: 2,
         });

         /* Add plotline value to invisible seri to make the plotline always visible. */
         chart.series[1].addPoint([1, options.value*1]);
      };

      const index = ticks.length;
      if(index == 0) return;

      const tick = _.last(ticks);
      el.chart.series[0].addPoint([index, tick.quote*1]);

      const plot_x = model.getPlotX(); // could return null
      plot_x && addPlotLineX(el.chart,plot_x);
      const plot_y = model.getPlotY(); // could return null
      plot_y && el.chart.yAxis[0].removePlotLine(plot_y.id);
      plot_y && addPlotLineY(el.chart, plot_y);

   } /* end of routine() */
};

const last_1000_ticks = []; /* record the last 1k ticks returned */
liveapi.events.on('tick', (data) => {
   const tick = data.tick;
   tick.quote *= 1;
   tick.epoch *= 1;
   last_1000_ticks.push(tick);
   if(last_1000_ticks.length > 1000)
      last_1000_ticks.shift();
});

const register_ticks = (state, extra) => {
   let tick_count = extra.tick_count * 1,
      symbol = extra.symbol,
      purchase_epoch = state.buy.purchase_time * 1,
      contract,
      fn = null;

   /* No need to worry about WS connection getting closed, because the user will be logged out */
   const add_tick = (tick) =>{
      if (_.findIndex(state.ticks.array, (t) => (t.epoch*1 === tick.epoch*1)) === -1 && tick_count > 0) {
         const decimal_digits = chartingRequestMap.digits_after_decimal(extra.pip, symbol);
         state.ticks.array.push({
            quote: tick.quote,
            epoch: tick.epoch,
            number: state.ticks.array.length + 1,
            tooltip: moment.utc(tick.epoch*1000).format("dddd, MMM D, HH:mm:ss") + "<br/>" +
            extra.symbol_name + " " + tick.quote.toFixed(decimal_digits),
            decimal_digits : decimal_digits
         });
         --tick_count;
         if (tick_count === 0) {
            state.ticks.update_status(contract.status);
            state.buy.update();
            /* show buy-price final and profit & update title */
            state.back.visible = true;
            /* show back button */
            liveapi.events.off('proposal_open_contract', fn);
            liveapi.proposal_open_contract.forget(extra.contract_id);
            /* unregister from proposal_open_contract stream */
         }
      }
   }

   let entry = null, expiry = null;
   let tracking_timeout_set = false;
   const track_ticks = () => {
      tracking_timeout_set = false;
      last_1000_ticks.filter(
         (tick) => (tick.symbol === extra.symbol && tick.epoch*1 >= entry && tick.epoch*1 <= expiry)
      ).forEach(add_tick);
      if(tick_count > 0) {
         tracking_timeout_set = true;
         setTimeout(track_ticks, 300);
      }
   }

   fn = liveapi.events.on('proposal_open_contract', (data) => {
      if(data.error) {
            $.growl.error({message: data.error.message});
            liveapi.proposal_open_contract.forget(data.echo_req.contract_id);
            liveapi.proposal_open_contract.subscribe(data.echo_req.contract_id);
            return;
      }
      contract = data.proposal_open_contract;
      if(contract.contract_id !== extra.contract_id) return;
      entry = contract.entry_tick_time ? contract.entry_tick_time * 1 : entry;
      // DONT TRUST BACKEND! I'm really angry right now :/
      // Try everything before calculating expiry.
      expiry = contract.exit_tick_time ? contract.exit_tick_time * 1 : contract.date_expiry ? contract.date_expiry * 1: expiry;
      if(!tracking_timeout_set && entry && expiry)
         track_ticks();
      return;
   });
}

/** @param data
*  @param extra = {
*    currency: ,
*    symbol: "frxXAUUSD",
*    symbol_name: "Gold/USD",
*    category: {},
*    category_display: ,
*    duration_unit: ,
*      pip: "0.001",
*   }
* @param show_callback
* @param hide_callback
**/
export const init = (data, extra, show_callback, hide_callback) => {
   const root = $(html).i18n();
   const buy = data.buy;
   const decimal_digits = chartingRequestMap.digits_after_decimal(extra.pip, extra.symbol);
   extra.getbarrier = (tick) => {
      let barrier = tick.quote*1;
      if(extra.barrier && !_(['rise','fall']).includes(extra.category_display.name)) {
         barrier += extra.barrier*1;
      }
      return barrier.toFixed(decimal_digits);
   }
   const state = {
      title: {
         text: 'Contract Confirmation'.i18n(),
      },
      buy: {
         barrier: null,
         message: buy.longcode,
         balance_after: buy.balance_after,
         buy_price: (+buy.buy_price).toFixed(currencyFractionalDigits()),
         purchase_time: buy.purchase_time,
         start_time: buy.start_time,
         transaction_id: buy.transaction_id,
         payout: (+buy.payout).toFixed(currencyFractionalDigits()),
         currency: extra.currency,
         potential_profit : (buy.payout - buy.buy_price).toFixed(currencyFractionalDigits()),
         potential_profit_text : 'Profit'.i18n(),
         show_result: false,
      },
      spreads: {
         amount_per_point: buy.amount_per_point || '0',
         stop_loss_level: buy.stop_loss_level || '0',
         stop_profit_level: buy.stop_profit_level || '0',
      },
      ticks: {
         array: [],
         average: () => {
            const ticks = state.ticks;
            const array = ticks.array;
            let sum = 0;
            for(let i = 0; i < array.length; ++i)
               sum += array[i].quote*1;
            const avg = sum / (array.length || 1);
            return avg;
         },
         getPlotX: () => {
            const ticks = state.ticks;
            const inx = ticks.array.length;
            if(inx === 1) return {value: inx, label: 'Entry Spot'.i18n()};
            if(inx === ticks.tick_count) return {value:inx, label: 'Exit Spot'.i18n()}
            return null;
         },
         getPlotY: () => {
            const ticks = state.ticks;
            const inx = ticks.array.length;
            const tick = ticks.array[inx-1];
            const categories_with_barrier = ['callput', 'callputequal'];
            const should_add_barrier = (inx === 1 && _(categories_with_barrier).includes(ticks.category.contract_category));

            if (should_add_barrier) {
               const barrier = extra.getbarrier(tick);
               state.buy.barrier = barrier; /* update barrier value to show in confirm dialog */
               return {value: barrier*1, label:'Barrier ('.i18n() +barrier+')', id: 'plot-barrier-y'};
            }

            if(ticks.category.contract_category === 'asian') {
               const avg = ticks.average().toFixed(decimal_digits + 1);
               return {value: avg, label:'Average ('.i18n() + avg + ')', id: 'plot-barrier-y'};
            }
            return null;
         },
         tick_count: extra.tick_count,
         value: (extra.digits_value || '0') + '', // last digit value selected by the user
         category: extra.category,
         category_display: extra.category_display,

         status: 'waiting', /* could be 'waiting', 'lost' or 'won' */
         chart_visible: extra.show_tick_chart,
      },
      arrow: {
         visible: !extra.show_tick_chart && extra.category.contract_category !== 'digits',
      },
      back: { visible: false }, /* back buttom */
   };

   if (Lookback.isLookback(extra.category_display.contract_type)) {
     state.buy.payout = Lookback.formula(extra.category_display.contract_type, extra.amount);
     state.buy.potential_profit = undefined;
   }

   state.buy.update = () => {
      const status = state.ticks.status;
      state.title.text = { waiting: 'Contract Confirmation'.i18n(),
         won : 'This contract won'.i18n(),
         lost: 'This contract lost'.i18n()
      }[status];
      if(status === 'lost') {
         state.buy.potential_profit = (-state.buy.buy_price).toFixed(currencyFractionalDigits());
         state.buy.payout = (0).toFixed(currencyFractionalDigits());
         state.buy.potential_profit_text = 'Lost';
      }
      if(status === 'won') {
         state.buy.balance_after = buy.balance_after*1 + state.buy.payout*1;
         liveapi.sell_expired(); // to update balance immediately
      }
      state.buy.show_result = true;
   }

   state.ticks.update_status = (response_status) => {
      const category = state.ticks.category.contract_category;
      // sometimes BE does not return correct status at end of ticks
      const no_response_status = response_status === 'open';
      if (no_response_status) {
            state.ticks.status = make_status(category);
      } else {
            state.ticks.status = response_status;
      }
   };

   const make_status = (category) => {
      const decimal_digits = chartingRequestMap.digits_after_decimal(extra.pip, extra.symbol);
      const contract_type = state.ticks.category_display.sentiment;
      const last_quote = _.last(state.ticks.array).quote.toFixed(decimal_digits) + '';
      switch (category) {
            case 'digits':
                  return digit_status(contract_type, last_quote);
            case 'asian':
                  return asian_status(contract_type, last_quote);
            case 'callput':
                  return callput_status(contract_type, last_quote);
            default:
                  throw new Error('Contract does not have status: ', contract_type);
      };
   };

   const asian_status = (contract_type, last_quote) => {
      const average = state.ticks.average().toFixed(5);
      const contract_type_status = {
            up: average < last_quote*1,
            down: average > last_quote*1,
      };
      const won_or_lost = contract_type_status[contract_type] ? 'won' : 'lost';
      return won_or_lost;
   };

   const digit_status = (contract_type, last_quote) => {
      const digits_value = state.ticks.value + '';
      const contract_type_status = {
            match:  _.last(last_quote) === digits_value,
            differ:  _.last(last_quote) !== digits_value,
            over: _.last(last_quote)*1 > digits_value*1,
            under: _.last(last_quote)*1 < digits_value*1,
            odd: (_.last(last_quote)*1)%2 === 1,
            even: (_.last(last_quote)*1)%2 === 0
      };
      const won_or_lost = contract_type_status[contract_type] ? 'won' : 'lost';
      return won_or_lost;
   };

   const callput_status = (contract_type, last_quote) => {
      const barrier = extra.getbarrier(_.head(state.ticks.array)) + '';
      const contract_type_status = {
            up: last_quote*1 > barrier*1,
            down: last_quote*1 < barrier*1,
      }
      const won_or_lost = contract_type_status[contract_type] ? 'won' : 'lost';
      return won_or_lost;
   };
//    callputequal: {
//       up: last_quote*1 >= barrier*1,
//       down: last_quote*1 =< barrier*1,
//    },

   state.back.onclick = () => hide_callback(root);
   state.arrow.onclick = (e) => {
      const $target = $(e.target);
      if(!$target.hasClass('disabled')) {
         $target.addClass('disabled');
         require(['viewtransaction/viewTransaction'], (viewTransaction) => {
            viewTransaction.init(extra.contract_id, extra.transaction_id)
               .then(() => $target.removeClass('disabled'));
         });
      }
   };

   const view = rv.bind(root[0], state)

   if(!state.arrow.visible) { register_ticks(state, extra); }
   else { state.back.visible = true; }

   show_callback(root);
}

export default  { init }
