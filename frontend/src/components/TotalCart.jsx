import PropTypes from "prop-types";
import { Button, Col, Row } from "react-bootstrap";
import { FaCartArrowDown } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { saveOrder } from "../features/CartSlice.js";
import Swal from "sweetalert2";
import { useMemo } from "react";

const TotalCart = ({ carts = [] }) => {
  const dispatch = useDispatch();

  const sum = useMemo(
    () => carts.reduce((total, item) => total + parseInt(item.totalPrice), 0),
    [carts]
  );

  const saveCartData = () => {
    const orderData = {
      date: new Date().toISOString(),
      total: sum,
      detail: carts,
    };

    dispatch(saveOrder(orderData));

    Swal.fire("Order Success!", "", "success").then(() => {
      console.log("Order berhasil disimpan!", orderData);
    });
  };

  return (
    <div className="fixed-bottom">
      <Row>
        <Col md={{ span: 3, offset: 9 }} className="bg-body pt-2">
          <div className="px-3">
            <h4>
              Total Bayar:{" "}
              <strong className="float-end me-3">
                Rp {sum.toLocaleString("id-ID")}
              </strong>
            </h4>
            <Button
              variant="primary"
              className="w-100 me-3 mb-3"
              size="lg"
              onClick={saveCartData}
              disabled={carts.length === 0}
            >
              <FaCartArrowDown /> Bayar
            </Button>
          </div>
        </Col>
      </Row>
    </div>
  );
};

TotalCart.propTypes = {
  carts: PropTypes.array,
};

export default TotalCart;
