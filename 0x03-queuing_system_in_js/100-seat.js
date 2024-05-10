import { createClient } from 'redis';
import { createQueue } from 'kue';
import { promisify } from 'util';
import express from 'express';

const app = express();
const client = createClient();
const queue = createQueue();
const HOST = '127.0.0.1';
const PORT = 1245;
let reservationEnabled = true;


function reserveSeat(number) {
  client.set('available_seats', number);
}

async function getCurrentAvailableSeats() {
  const Async = promisify(client.get).bind(client);
  const seats = await Async('available_seats');
  return Number(seats);
}

app.get('/available_seats', async (req, res) => {
  const seats = await getCurrentAvailableSeats();
  res.send({ numberOfAvailableSeats: seats });
});

app.get('/reserve_seat', (_req, res) => {
  if (!reservationEnabled) {
    res.send({ status: 'Reservation are blocked' });
    return;
  }
  res.send({ status: 'Reservation in process' });
  const reserveSeatJob = queue.create('reserve_seat').save();
  reserveSeatJob.on('complete', () => {
    console.log(`Seat reservation job ${reserveSeatJob.id} completed`);
  });
  reserveSeatJob.on('failed', (errorMessage) => {
    console.log(`Seat reservation job ${reserveSeatJob.id} failed ${errorMessage}`);
  });
});

app.get('/process', (_req, res) => {
  queue.process('reserve_seat', async (_job, done) => {
    let seats = await getCurrentAvailableSeats();
    if (!seats) {
      done(new Error('Not enough seats available'));
      return;
    }
    seats -= 1;
    reserveSeat(seats);
    if (!seats) reservationEnabled = false;
    done();
  });
  res.send({ status: 'Queue processing' });
});

app.listen(PORT, HOST, () => {
  console.log(`Server is live at ${HOST}:${PORT}`);
});
