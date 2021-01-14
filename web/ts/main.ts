import InfiniteScroll from 'infinite-scroll';

const infScroll = new InfiniteScroll('.commit-container', {
    // options
    path: function () {
        const elem = document.querySelector<HTMLAnchorElement>('.pagination__next');
        const linkTarget = elem?.href;
        const startIdx = (linkTarget?.indexOf('page-') ?? 0) + 'page-'.length;
        const endIdx = linkTarget?.indexOf('.html') ?? 0;
        const pageNumber = parseInt(linkTarget?.substring(startIdx, endIdx) ?? '1') + 1;

        return `page/page-${pageNumber - this.loadCount - 1}.html`;
    },
    append: '.commit__wrapper',
    history: false,
    prefill: true,
});
