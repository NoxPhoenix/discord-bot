const FeedMe = require('feedme');
const http = require('http');

http.get('http://lfmannfield.podbean.com/feed/', (res) => {
  const parser = new FeedMe();
  parser.on('title', (title) => {
    console.log('title of feed is', title);
  });
  parser.on('item', (item) => {
    console.log();
    console.log('news:', item.title);
    console.log(item.description);
  });
  res.pipe(parser);
});
