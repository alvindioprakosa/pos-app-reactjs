import React, { useEffect, useState } from "react";
import { Col, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCart, setDetail } from "../features/CartSlice.js";
import TotalCart from "./TotalCart.jsx";
import CartModal from "./CartModal.jsx";

const Order = () => {
  const dispatch = useDispatch();

  // Ambil data dari state Redux
  const carts = useSelector((state) => state.cart.data);
  const loading = useSelector((state) => state.cart.loading);
  const error = useSelector((state) => state.cart.error);

  // State untuk menampilkan modal detail cart
  const [modalShow, setModalShow] = useState(false);

  // Ambil data cart saat komponen pertama kali dimount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        await dispatch(getCart());
      } catch (error) {
        console.error("Error fetching cart data:", error);
      }
    };
    fetchCart();
  }, [dispatch]);

  return (
    <>
      <Col md={3} className="mb-5 pb-5">
        <h4>Order List</h4>
        {error && <p className="text-danger">{error}</p>}
        <hr />
        <ListGroup variant="flush">
          {/* Tampilkan loading, data cart, atau pesan kosong */}
          {loading ? (
            <p>Loading...</p>
          ) : Array.isArray(carts) && carts.length > 0 ? (
            carts.map((item) => (
              <ListGroup.Item
                key={item.id}
                variant="flush"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  dispatch(setDetail(item));
                  setModalShow(true);
                }}
              >
                <div className="fw-bold">{item.name}</div>
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-auto">
                    <small>
                      Rp {parseInt(item.price).toLocaleString("id-ID")} x{" "}
                      {item.qty}
                    </small>
                    <p className="mb-0">
                      <small>{item.note}</small>
                    </p>
                  </div>
                  <div>
                    <strong>
                      <small>
                        Rp{" "}
                        {parseInt(item.price * item.qty).toLocaleString(
                          "id-ID"
                        )}
                      </small>
                    </strong>
                  </div>
                </div>
              </ListGroup.Item>
            ))
          ) : (
            <p>No data</p>
          )}
        </ListGroup>

        {/* Komponen total */}
        <TotalCart carts={carts} />
      </Col>

      {/* Modal untuk detail cart */}
      <CartModal show={modalShow} onHide={() => setModalShow(false)} />
    </>
  );
};

export default Order;
