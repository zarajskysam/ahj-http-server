const http = require('http');
const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();



const tickets = [{
  id: 0,
  name: 'Проснуться',
  description: 'Не забудь почистить зубы',
  status: 'false',
  created: '1507705840212',
},
{
  id: 1,
  name: 'Пойти на работу',
  description: 'Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.Проездной на полке.',
  status: 'false',
  created: '1507705840212',
}];

app.use(koaBody({
  urlencoded: true,
}));

app.use(async (ctx) => {
  ctx.response.set({
    'Access-Control-Allow-Origin' : '*',
  });
  const { method, id } = ctx.request.query;
  switch (method) {
    case 'allTickets':
      ctx.response.body = tickets;
      return;
    case 'ticketById':
      let itemId = tickets.find((item) => item.id.toString() === id.toString());
      ctx.response.body = itemId;
      if (!ctx.response.body) {
        ctx.response.status = 404;
      }
      return;
    case 'createTicket':
      let item = JSON.parse(ctx.request.body);
      item.id = tickets[tickets.length - 1].id + 1;
      tickets.push(item);
      ctx.response.status = 201;
      return;
    case 'deleteTicket':
      let deleteId = JSON.parse(ctx.request.body);
      for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].id.toString() === deleteId.toString()) {
          tickets.splice(i, 1);
        }
      }
      ctx.response.status = 200;
      return;
    case 'editTicket':
      let editBody = JSON.parse(ctx.request.body);
      for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].id.toString() === editBody.id.toString()) {
          tickets.splice(i, 1, editBody);
        }
      }
      ctx.response.status = 200;
      return;
    case 'checkStatus':
      let statusBody = JSON.parse(ctx.request.body);
      for (let i = 0; i < tickets.length; i++) {
        if (tickets[i].id.toString() === statusBody.id.toString()) {
          tickets[i].status = statusBody.status;
        }
      }
      ctx.response.status = 201;
    default:
      ctx.response.status = 404;
      return;
  }
});


const port = process.env.PORT || 7070;
const server = http.createServer(app.callback()).listen(port);
