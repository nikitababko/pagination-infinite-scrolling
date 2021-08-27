import React, { useState, useEffect } from 'react';
import axios from 'axios';

import './App.css';

interface IPhoto {
  albumId: number;
  id: number;
  thumbnailUrl: string;
  title: string;
  url: string;
}

const App = () => {
  const [photos, setPhotos] = useState<IPhoto[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [fetching, setFetching] = useState<boolean>(true);
  const [totalCount, setTotalCount] = useState<number>(0);

  useEffect(() => {
    if (fetching) {
      axios
        .get(
          `https://jsonplaceholder.typicode.com/photos?_limit=10&_page=${currentPage}`
        )
        .then((res) => {
          setPhotos([...photos, ...res.data]);
          setCurrentPage(currentPage + 1);
          // Проверка: остались ли еще фотграфии
          setTotalCount(res.headers['x-total-count']);
        })
        .finally(() => setFetching(false));
    }
  }, [fetching]);

  useEffect(() => {
    document.addEventListener('scroll', scrollHandler);

    return () => {
      document.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  // Функция, которая вызывается при скроле
  const scrollHandler = (e: any) => {
    // scrollHeight - общая высота страницы с учетом скролла
    // scrollTop - текущее положение скролла от верха страницы
    // innerHeight - высота видимой области страницы(высота браузера)
    if (
      e.target.documentElement.scrollHeight -
        (e.target.documentElement.scrollTop + window.innerHeight) <
        100 &&
      photos.length < totalCount
    ) {
      setFetching(true);
    }
  };

  return (
    <div className="app">
      {photos.map((photo) => (
        <div key={photo.id} className="photo">
          <div className="title">
            {photo.id} {photo.title}
          </div>
          <img src={photo.thumbnailUrl} alt={photo.title} />
        </div>
      ))}
    </div>
  );
};

export default App;
