import React, { useEffect, useState } from 'react'
import NewsItem from './NewsItem'
import Spinner from './Spinner';
import PropTypes from 'prop-types'
import InfiniteScroll from 'react-infinite-scroll-component';

const News = (props) => {

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const updateNews = async () => {
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;
    props.setProgress(10);
    setLoading(true)
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);
    setArticles(parsedData.articles)
    setTotalResults(parsedData.totalResults)
    setLoading(false)
    props.setProgress(100);
  }

  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, [])

  // const handlePreviousClick = async () => {
  //   setPage(page - 1 );
  //   updateNews();
  // }
  // const handleNextClick = async () => {
  //   setPage(page + 1);
  //    updateNews();
  // }

  const fetchMoreData = async () => {
    setPage(page + 1)
    const url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page+1}&pageSize=${props.pageSize}`;
    let data = await fetch(url);
    let parsedData = await data.json()
    setArticles(articles.concat(parsedData.articles))
    setTotalResults(parsedData.totalResults)
  };

  return (
    <>
      <h1 className='text-center bg-warning rounded-pill' style={{ margin: '83px 29px 10px', padding: '5px' }}>Today's Top <span className="fw-bold text-primary">{capitalizeFirstLetter(props.category)}</span> Headlines</h1>
      {loading && <Spinner />}

      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length < totalResults}
        loader={<Spinner />}
        endMessage={
          <p style={{ textAlign: 'center' }}>
            <b>Yay! You have seen all the news!</b>
          </p>
        }
      >
        <div className='container my-3'>
          <div className="row">
            {articles.map((element) => {
              return <div className="col-md-4" key={element.url}>
                <NewsItem title={element.title ? element.title : ""} description={element.description ? element.description : ""} imageUrl={element.urlToImage} newsUrl={element.url} author={element.author} date={element.publishedAt} source={element.source.name} />
              </div>
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between">
          <button disabled={page <= 1} type="button" className="btn btn-dark" onClick={handlePreviousClick}> &larr; Previous</button>
          <button disabled={page + 1 >= Math.ceil(totalResults / props.pageSize)} type="button" className="btn btn-dark" onClick={handleNextClick}>Next &rarr;</button>
        </div> */}
    </>
  )
}

News.defaultProps = {
  country: 'in',
  pageSize: 8,
  category: 'general'
}

News.propTypes = {
  country: PropTypes.string,
  pageSize: PropTypes.number,
  category: PropTypes.string,
}

export default News