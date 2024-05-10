#!/usr/bin/yarn test
import sinon from 'sinon';
import { expect } from 'chai';
import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job.js';

describe('createPushNotificationsJobs', () => {
  const BIG_BROTHER = sinon.spy(console);
  const queJob = createQueue({ name: 'push_notification_code_test' });

  before(() => {
    queJob.testMode.enter(true);
  });

  after(() => {
    queJob.testMode.clear();
    queJob.testMode.exit();
  });

  afterEach(() => {
    BIG_BROTHER.log.resetHistory();
  });

  it('displays an error message if jobs is not an array', () => {
    expect(
      createPushNotificationsJobs.bind(createPushNotificationsJobs, {}, queJob)
    ).to.throw('Jobs is not an array');
  });

  it('adds jobs to the queue with the correct type', (done) => {
    expect(queJob.testMode.jobs.length).to.equal(0);
    const jobInfos = [
      {
        phoneNumber: '44556677889',
        message: 'Use the code 1982 to verify your account',
      },
      {
        phoneNumber: '4153518780',
        message: 'Use the code 1234 to verify your account',
      },
    ];
    createPushNotificationsJobs(jobInfos, queJob);
    expect(queJob.testMode.jobs.length).to.equal(2);
    expect(queJob.testMode.jobs[0].data).to.deep.equal(jobInfos[0]);
    expect(queJob.testMode.jobs[0].type).to.equal('push_notification_code_3');
    queJob.process('push_notification_code_3', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job created:', queJob.testMode.jobs[0].id)
      ).to.be.true;
      done();
    });
  });

  it('registers the progress event handler for a job', (done) => {
    queJob.testMode.jobs[0].addListener('progress', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', queJob.testMode.jobs[0].id, '25% complete')
      ).to.be.true;
      done();
    });
    queJob.testMode.jobs[0].emit('progress', 25);
  });

  it('registers the failed event handler for a job', (done) => {
    queJob.testMode.jobs[0].addListener('failed', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', queJob.testMode.jobs[0].id, 'failed:', 'Failed to send')
      ).to.be.true;
      done();
    });
    queJob.testMode.jobs[0].emit('failed', new Error('Failed to send'));
  });

  it('registers the complete event handler for a job', (done) => {
    queJob.testMode.jobs[0].addListener('complete', () => {
      expect(
        BIG_BROTHER.log
          .calledWith('Notification job', queJob.testMode.jobs[0].id, 'completed')
      ).to.be.true;
      done();
    });
    queJob.testMode.jobs[0].emit('complete');
  });
});
