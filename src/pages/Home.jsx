import React from "react";

import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
const Home = () => {
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [categoryId, setCategoryId] = React.useState(0);
  const [sortType, setSortType] = React.useState({
    name: 'популярности', 
    sortProperty: 'rating',
  });
  React.useEffect(() => {
    setIsLoading(true);

    const order = sortType.sortProperty.includes('-') ? 'asc' : 'desc';
    const sortBy = sortType.sortProperty.includes('-', '');
    const category = categoryId > 0 ? `category=${categoryId}` : '';

    fetch(
      `https://6368a9aa15219b8496034621.mockapi.io/items?${category}&sortBy=${sortBy}&order=${order}`, 
    )
      .then((res) => res.json())
      .then((arr) => {
        setTimeout(() => {
          setItems(arr);
          setIsLoading(false);
        });
      });
      window.scrollTo(0,  0);
  }, [categoryId, sortType]);
  return (
    <div cloassName="container">
      <div className="content__top">
        <Categories value={categoryId} onChangeCategory={(i) => setCategoryId(i)} />
        <Sort value={sortType} onChangeSort={(i) => setSortType(i)} />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">
        {isLoading
          ? [...new Array(6)].map((_, index) => <Skeleton key={index} />)
          : items.map((obj) => (
              <PizzaBlock
                key={obj}
                title={obj.title}
                price={obj.price}
                imgUrl={obj.imageUrl}
                sizes={obj.sizes}
                types={obj.types}
              />
            ))}
      </div>
    </div>
  );
};
export default Home;
