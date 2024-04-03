import React from "react";

import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
// import Table from "react-bootstrap/Table";
// import EditableField from "./EditableField";
import { useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import EditableField from "./EditableField";
import { BiPlusCircle, BiMinusCircle } from "react-icons/bi";

import Form from "react-bootstrap/Form";
const ProductsModal = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const {
    onProItemizedItemEdit,
    currency,
    onProDel,
    onProAdd,
    items,
    onRowAdd,
  } = props;

  const productTable = items.map((product) => (
    <ProductRow
      key={product.id}
      item={product}
      onDelEvent={onProDel}
      onProItemizedItemEdit={onProItemizedItemEdit}
      currency={currency}
      onRowAdd={onRowAdd}
    />
  ));

  return (
    <div className="mb-3">
      <Button
        variant="primary"
        className="fw-bold my-3"
        onClick={handleShow}
        size="sm"
      >
        Add Item From Saved
      </Button>
      <Offcanvas show={show} onHide={handleClose} scroll={true} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <h3 className="fw-bold">Product</h3>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Row>
            <Col md={4}></Col>
            <Col md={{ span: 4, offset: 4 }}>
              <Button
                variant="primary"
                onClick={onProAdd}
                className="flex mb-4"
              >
                Add New product{" "}
              </Button>
            </Col>
            <Table>
              <thead>
                <span className="fw-bold ">Basic Details</span>
                <tr>
                  <th>Item Name</th>
                  <th>Unit</th>
                  <th>Selling Price</th>
                  <th className="text-center">Action</th>
                </tr>
              </thead>
              <tbody>{productTable}</tbody>
            </Table>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
};

const ProductRow = (props) => {
  const [isAdded, setIsAdded] = useState(false);

  const onDelEvent = () => {
    props.onDelEvent(props.item);
  };

  const onRowAdd = () => {
    props.onRowAdd(props.item);
    setIsAdded(true);
  };

  return (
    <tr>
      <td style={{ width: "100%" }}>
        <EditableField
          onItemizedItemEdit={(evt) => {
            props.onProItemizedItemEdit(evt, props.item.itemId);
          }}
          cellData={{
            type: "text",
            name: "itemName",
            placeholder: "Item name",
            value: props.item.itemName,
            id: props.item.itemId,
          }}
        />
      </td>

      <td style={{ minWidth: "70px" }}>
        <EditableField
          onItemizedItemEdit={(evt) =>
            props.onProItemizedItemEdit(evt, props.item.itemId)
          }
          cellData={{
            type: "number",
            name: "itemQuantity",
            min: 1,
            step: "1",
            value: props.item.itemQuantity,
            id: props.item.itemId,
          }}
        />
      </td>
      <td style={{ minWidth: "130px" }}>
        <EditableField
          onItemizedItemEdit={(evt) => {
            props.onProItemizedItemEdit(evt, props.item.itemId);
          }}
          cellData={{
            leading: props.currency,
            type: "number",
            name: "itemPrice",
            min: 1,
            step: "0.01",
            presicion: 2,
            textAlign: "text-end",
            value: props.item.itemPrice,
            id: props.item.itemId,
          }}
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <BiMinusCircle
          onClick={onDelEvent}
          style={{ height: "33px", width: "33px", padding: "7.5px" }}
          className="text-white mt-1 btn btn-danger"
        />
      </td>
      <td className="text-center" style={{ minWidth: "50px" }}>
        <Button variant="outline-primary" onClick={onRowAdd} disabled={isAdded}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiPlusCircle />
          </div>
        </Button>
      </td>
    </tr>
  );
};

export default ProductsModal;
