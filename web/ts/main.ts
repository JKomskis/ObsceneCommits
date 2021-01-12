import InfiniteScroll from 'infinite-scroll';

const infScroll = new InfiniteScroll('.commit-container', {
    // options
    path: '.pagination__next',
    append: '.commit__wrapper',
    history: false,
});
