import { useEffect, useMemo } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getProduct } from "../features/ProductSlice.js";
import CardComponent from "./CardComponent.jsx";
import axios from "axios";
import { inputCart, updateCart } from "../features/CartSlice.js";

const ProductDetail = () => {
  const dispatch = useDispatch();
  const products = useSelector((state) => state.product.data);
  const loading = useSelector((state) => state.product.loading);
  const error = useSelector((state) => state.product.error);

  useEffect(() => {
    dispatch(getProduct());
  }, [dispatch]);

  const setCart = async (product) => {
    try {
      const response = await axios.get(`/carts?productId=${product.id}`);

      if (response.data?.length > 0) {
        // Update cart
        const orderItem = response.data[0];
        const newQty = parseInt(orderItem.qty) + 1;
        dispatch(
          updateCart({
            ...orderItem,
            qty: newQty,
            totalPrice: parseInt(orderItem.price) * newQty,
          })
        );
      } else {
        // Insert cart
        dispatch(
          inputCart({
            qty: 1,
            price: product.price,
            name: product.name,
            totalPrice: product.price,
            note: "",
            productId: product.id,
          })
        );
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  const productList = useMemo(() => {
    return Array.isArray(products) ? products : [];
  }, [products]);

  return (
    <Col md={7}>
      <h4>Product Detail</h4>
      {error && <p className="text-danger">{error}</p>}
      <hr />
      <Row>
        {loading ? (
          <p>Loading...</p>
        ) : productList.length > 0 ? (
          productList.map((item) => (
            <CardComponent key={item.id} product={item} setCart={setCart} />
          ))
        ) : (
          <p>No data</p>
        )}
      </Row>
    </Col>
  );
};

export default ProductDetail;
