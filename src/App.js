import React from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Drawer from "./components/Drawer";
import Header from "./components/Header";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

function App() {
  const [items, setItems] = React.useState([]);
  const [cartItems, setCartItems] = React.useState([]);
  const [favorites, setFavorites] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState("");
  const [cartOpened, setCartOpened] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    /*fetch("https://631af04afae3df4dcfef9e3d.mockapi.io/items")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setItems(json);
      }); */

    /* axios
      .get("https://631af04afae3df4dcfef9e3d.mockapi.io/items")
      .then((response) => {
        setItems(response.data);
      });
    axios
      .get("https://631af04afae3df4dcfef9e3d.mockapi.io/cart")
      .then((response) => {
        setCartItems(response.data);
      });
    axios
      .get("https://631af04afae3df4dcfef9e3d.mockapi.io/favorites")
      .then((response) => {
        setFavorites(response.data);
      });*/

    async function fetchData() {
      setIsLoading(true);
      const cartResponse = await axios.get(
        "https://631af04afae3df4dcfef9e3d.mockapi.io/cart"
      );
      const favoriteResponse = await axios.get(
        "https://631af04afae3df4dcfef9e3d.mockapi.io/favorites"
      );
      const itemsResponse = await axios.get(
        "https://631af04afae3df4dcfef9e3d.mockapi.io/items"
      );
      setIsLoading(false);
      setCartItems(cartResponse.data);
      setFavorites(favoriteResponse.data);
      setItems(itemsResponse.data);
    }
    fetchData();
  }, []);

  function onAddToCart(obj) {
    try {
      if (cartItems.find((item) => Number(item.id) === Number(obj.id))) {
        axios.delete(
          `https://631af04afae3df4dcfef9e3d.mockapi.io/cart/${obj.id}`
        );
        setCartItems((prev) =>
          prev.filter((item) => Number(item.id) !== Number(obj.id))
        );
      } else {
        axios.post("https://631af04afae3df4dcfef9e3d.mockapi.io/cart", obj);
        setCartItems((prev) => [...prev, obj]);
      }
    } catch (error) {
      alert("Ошибка при добавлении в корзину");
      console.error(error);
    }
  }

  function onChangeSearchInput(e) {
    setSearchValue(e.target.value);
  }

  function onRemoveItem(id) {
    axios.delete(`https://631af04afae3df4dcfef9e3d.mockapi.io/cart/${id}`);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function onAddToFavorite(obj) {
    try {
      if (favorites.find((favObj) => favObj.id === obj.id)) {
        axios.delete(
          `https://631af04afae3df4dcfef9e3d.mockapi.io/favorites/${obj.id}`
        );
        setFavorites((prev) => prev.filter((item) => item.id !== obj.id));
      } else {
        const { data } = await axios.post(
          "https://631af04afae3df4dcfef9e3d.mockapi.io/favorites",
          obj
        );
        setFavorites((prev) => [...prev, data]);
      }
    } catch (error) {
      alert("Не удалось добавить в избранное");
    }
  }

  return (
    <div className="wrapper clear">
      {cartOpened && (
        <Drawer
          items={cartItems}
          onClose={() => setCartOpened(false)}
          onRemove={onRemoveItem}
        />
      )}
      <Header onClickCart={() => setCartOpened(true)} />
      <Routes>
        <Route
          path="/"
          element={
            <Home
              items={items}
              cartItems={cartItems}
              searchValue={searchValue}
              setSearchValue={setSearchValue}
              onChangeSearchInput={onChangeSearchInput}
              onAddToFavorite={onAddToFavorite}
              onAddToCart={onAddToCart}
              sLoading={isLoading}
            />
          }
        />

        <Route
          path="/favorites"
          element={
            <Favorites items={favorites} onAddToFavorite={onAddToFavorite} />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
