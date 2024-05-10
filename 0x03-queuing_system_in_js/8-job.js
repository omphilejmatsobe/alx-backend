export default function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) throw new Error('Jobs is not an array');
  jobs.forEach((jobData) => {
    const queJob = queue.create('push_notification_code_3', jobData);
    queJob.save((error) => {
      if (!error) console.log(`Notification job created: ${job.id}`);
    });
    queJob.on('complete', () => console.log(`Notification job ${job.id} completed`));
    queJob.on('progress', (progress) => console.log(`Notification job ${job.id} ${progress}% completed`));
    queJob.on('failed', (errorMessage) => console.log(`Notification job ${job.id} failed: ${errorMessage}`));
  });
}
