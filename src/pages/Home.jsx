import React from "react";
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";

import { setCategoryId, setCurrentPage } from '../redux/slices/filterSlice';
import Categories from "../components/Categories";
import Sort from "../components/Sort";
import PizzaBlock from "../components/PizzaBlock";
import Skeleton from "../components/PizzaBlock/Skeleton";
import Pagination from "../components/Pagination";

import { SearchContext } from '../App';

const Home = () => {
  const dispatch = useDispatch();
  const {categoryId, sort, currentPage } = useSelector(state => state.filter);
  const { searchValue } = React.useContext(SearchContext);
  const [items, setItems] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);


  const onChangePage = number => {
    dispatch(setCurrentPage(number))
  }

  const onChangeCategory = (id) => {
    dispatch(setCategoryId(id));
  };
;
  React.useEffect(() => {
    setIsLoading(true);

    const sortBy = sort.sortProperty.replace('-', '');
    const order = sort.sortProperty.includes("-") ? "asc" : "desc";
    const category = categoryId > 0 ? `category=${categoryId}` : '';
    const search = searchValue > 0 ? `&search=${searchValue}` : '';

      axios
        .get (
            `https://6368a9aa15219b8496034621.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
          )
          .then(res => {
            setItems(res.data);
            setIsLoading(false);
          });
    window.scrollTo(0, 0);
  }, [categoryId, sort.sortProperty, searchValue, currentPage]);

  const pizzas = items
    .filter((obj) => {
      if (obj.title.toLowerCase().includes(searchValue)) {
        return true;
      }
      return false;
    })
    .map((obj) => (
      <PizzaBlock
        key={obj}
        title={obj.title}
        price={obj.price}
        imgUrl={obj.imageUrl}
        sizes={obj.sizes}
        types={obj.types}
      />
    ));
  const skeletons = [...new Array(6)].map((_, index) => (
    <Skeleton key={index} />
  ));

  return (
    <div cloassName="container">
      <div className="content__top">
        <Categories
          value={categoryId}
          onChangeCategory={onChangeCategory}
        />
        <Sort />
      </div>
      <h2 className="content__title">Все пиццы</h2>
      <div className="content__items">{isLoading ? skeletons : pizzas}</div>
      <Pagination currentPage={currentPage} onChangePage={onChangePage} />
    </div>
  );
};
export default Home;
