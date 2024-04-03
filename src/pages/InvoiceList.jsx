import React, { useState, useEffect } from "react";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import { BiSolidPencil, BiTrash } from "react-icons/bi";
import { BsEyeFill } from "react-icons/bs";
import InvoiceModal from "../components/InvoiceModal";
import { useInvoiceListData } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { deleteInvoice } from "../redux/invoicesSlice";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import ProductsModal from "../components/ProductsModal";
import { updateProduct, addProduct } from "../redux/productsSlice";
import { useProductListData } from "../redux/hooks";
import generateRandomId from "../utils/generateRandomId";

const InvoiceList = () => {

  const { getOneInvoice, invoiceList } = useInvoiceListData();
  const isListEmpty = invoiceList.length === 0;
  const [copyId, setCopyId] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const isCopy = location.pathname.includes("create");
  const isEdit = location.pathname.includes("edit");

  const [isOpen, setIsOpen] = useState(false);
  const { getOneProduct } = useProductListData();
  const [proFormData, setProFormData] = useState(
    isEdit
      ? getOneProduct(params.id)
      : isCopy && params.id
      ? {
          ...getOneProduct(params.id),
          id: generateRandomId(),
          invoiceNumber: invoiceList + 1,
        }
      : {
          id: generateRandomId(),
          currentDate: new Date().toLocaleDateString(),
          invoiceNumber: invoiceList + 1,
          dateOfIssue: "",
          billTo: "",
          billToEmail: "",
          billToAddress: "",
          billFrom: "",
          billFromEmail: "",
          billFromAddress: "",
          notes: "",
          total: "0.00",
          subTotal: "0.00",
          taxRate: "",
          taxAmount: "0.00",
          discountRate: "",
          discountAmount: "0.00",
          currency: "$",
          items: [
            {
              itemId: 0,
              itemName: "",
              itemDescription: "",
              itemPrice: "1.00",
              itemQuantity: 1,
            },
          ],
        }
  );

  const handleCopyClick = () => {
    const invoice = getOneInvoice(copyId);
    if (!invoice) {
      alert("Please enter the valid invoice id.");
    } else {
      navigate(`/create/${copyId}`);
    }
  };
  const handleProAddEvent = () => {
    const id = (+new Date() + Math.floor(Math.random() * 999999)).toString(36);
    const newItem = {
      itemId: id,
      itemName: "",
      itemDescription: "",
      itemPrice: "1.00",
      itemQuantity: 1,
    };
    setProFormData({
      ...proFormData,
      items: [...proFormData.items, newItem],
    });
    handleAddProductToRedux();
  };

  const handleProDel = (itemToDelete) => {
    const updatedItems = proFormData.items.filter(
      (item) => item.itemId !== itemToDelete.itemId
    );
    setProFormData({ ...proFormData, items: updatedItems });
    handleAddProductToRedux();
  };

  const onProItemizedItemEdit = (evt, id) => {
    console.log("🚀 ~ onProItemizedItemEdit ~ evt, id:", evt.target.value)
    const updatedItems = proFormData.items.map((oldItem) => {
      if (oldItem.itemId === id) {
        return { ...oldItem, [evt.target.name]: evt.target.value };
      }
      return oldItem;
    });

    setProFormData({ ...proFormData, items: updatedItems });
    handleAddProductToRedux();
  };

  const handleAddProductToRedux = () => {
    if (isEdit) {
      dispatch(updateProduct({ id: params.id, updatedInvoice: proFormData }));
      //alert("Product updated successfuly 🥳");
    } else if (isCopy) {
      dispatch(addProduct({ id: generateRandomId(), ...proFormData }));
     // alert("Product added successfuly 🥳");
    } else {
      dispatch(addProduct(proFormData));
      //alert("Product added successfuly 🥳");
    }
  }


  return (
    <Row>
      <Col className="mx-auto" xs={12} md={8} lg={9}>
        <h3 className="fw-bold pb-2 pb-md-4 text-center">Swipe Assignment</h3>
        <Tabs
          defaultActiveKey="home"
          id="fill-tab-example"
          className="mb-3 fixed"
          fill
        >
          <Tab eventKey="home" title="Home">
            <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
              {isListEmpty ? (
                <div className="d-flex flex-column align-items-center">
                  <h3 className="fw-bold pb-2 pb-md-4">No invoices present</h3>
                  <Link to="/create">
                    <Button variant="primary">Create Invoice</Button>
                  </Link>
                </div>
              ) : (
                <div className="d-flex flex-column">
                  <div className="d-flex flex-row align-items-center justify-content-between">
                    <h3 className="fw-bold pb-2 pb-md-4">Invoice List</h3>
                    <Link to="/create">
                      <Button variant="primary mb-2 mb-md-4">
                        Create Invoice
                      </Button>
                    </Link>

                    <div className="d-flex gap-2">
                      <Button
                        variant="dark mb-2 mb-md-4"
                        onClick={handleCopyClick}
                      >
                        Copy Invoice
                      </Button>

                      <input
                        type="text"
                        value={copyId}
                        onChange={(e) => setCopyId(e.target.value)}
                        placeholder="Enter Invoice ID to copy"
                        className="bg-white border"
                        style={{
                          height: "50px",
                        }}
                      />
                    </div>
                  </div>
                  <Table responsive>
                    <thead>
                      <tr>
                        <th>Invoice No.</th>
                        <th>Bill To</th>
                        <th>Due Date</th>
                        <th>Total Amt.</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceList.map((invoice) => (
                        <InvoiceRow
                          key={invoice.id}
                          invoice={invoice}
                          navigate={navigate}
                        />
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card>
          </Tab>
          <Tab eventKey="product" title="Product">
            <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
              <div className="d-flex flex-column align-items-center">
              <h3 className="fw-bold pb-2 pb-md-4">Product</h3>
                <ProductsModal 
                onProAdd={handleProAddEvent}
                onProDel={handleProDel}
                onProItemizedItemEdit={onProItemizedItemEdit}
                currency={proFormData.currency}
                items={proFormData.items}
                />                
              </div>
            </Card>
          </Tab>
        </Tabs>
      </Col>
    </Row>
  );
};

const InvoiceRow = ({ invoice, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteClick = (invoiceId) => {
    dispatch(deleteInvoice(invoiceId));
  };

  const handleEditClick = () => {
    navigate(`/edit/${invoice.id}`);
  };

  const openModal = (event) => {
    event.preventDefault();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <tr>
      <td>{invoice.invoiceNumber}</td>
      <td className="fw-normal">{invoice.billTo}</td>
      <td className="fw-normal">{invoice.dateOfIssue}</td>
      <td className="fw-normal">
        {invoice.currency}
        {invoice.total}
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="outline-primary" onClick={handleEditClick}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiSolidPencil />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="danger" onClick={() => handleDeleteClick(invoice.id)}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BiTrash />
          </div>
        </Button>
      </td>
      <td style={{ width: "5%" }}>
        <Button variant="secondary" onClick={openModal}>
          <div className="d-flex align-items-center justify-content-center gap-2">
            <BsEyeFill />
          </div>
        </Button>
      </td>
      <InvoiceModal
        showModal={isOpen}
        closeModal={closeModal}
        info={{
          isOpen,
          id: invoice.id,
          currency: invoice.currency,
          currentDate: invoice.currentDate,
          invoiceNumber: invoice.invoiceNumber,
          dateOfIssue: invoice.dateOfIssue,
          billTo: invoice.billTo,
          billToEmail: invoice.billToEmail,
          billToAddress: invoice.billToAddress,
          billFrom: invoice.billFrom,
          billFromEmail: invoice.billFromEmail,
          billFromAddress: invoice.billFromAddress,
          notes: invoice.notes,
          total: invoice.total,
          subTotal: invoice.subTotal,
          taxRate: invoice.taxRate,
          taxAmount: invoice.taxAmount,
          discountRate: invoice.discountRate,
          discountAmount: invoice.discountAmount,
        }}
        items={invoice.items}
        currency={invoice.currency}
        subTotal={invoice.subTotal}
        taxAmount={invoice.taxAmount}
        discountAmount={invoice.discountAmount}
        total={invoice.total}
      />
    </tr>
  );
};

export default InvoiceList;
