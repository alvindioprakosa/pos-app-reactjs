import { Card, Col } from "react-bootstrap";
import PropTypes from "prop-types";

const CardComponent = ({ product, setCart }) => {
  if (!product) return null; // Hindari error jika product tidak tersedia

  return (
    <Col md={4} xs={6} className="mb-4">
      <Card
        className="shadow"
        onClick={() => setCart(product)}
        style={{ cursor: "pointer" }} // Menambahkan cursor pointer
      >
        <Card.Img
          variant="top"
          src={`/img/${product.image}`}
          alt={product.name} // Tambahkan alt untuk aksesibilitas
        />
        <Card.Body>
          <Card.Title>{`${product.name} (${product.code})`}</Card.Title>
          <Card.Text>Rp. {product.price.toLocaleString("id-ID")}</Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

CardComponent.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    code: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
  }).isRequired,
  setCart: PropTypes.func.isRequired,
};

export default CardComponent;
