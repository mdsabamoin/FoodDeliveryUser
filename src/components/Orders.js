import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Table, Badge, Spinner } from 'react-bootstrap';
import { fetchOrdersAsync } from '../redux/orderSlice';

const Orders = () => {
  const dispatch = useDispatch();
  const { orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrdersAsync());
  }, [dispatch]);
   
  console.log("orders in orders.js file",orders)
  return (
    <Container className="mt-4">
      <h2 className="text-center mb-4">Your Orders</h2>

      {status === 'loading' && (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Loading your orders...</p>
        </div>
      )}

      {status === 'failed' && <p className="text-danger text-center">{error}</p>}

      {status === 'succeeded' && orders.length === 0 && (
        <p className="text-center">You have no orders yet.</p>
      )}

      {status === 'succeeded' && orders.length > 0 && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>#</th>
              <th>Customer Name</th>
              <th>Items</th>
              <th>Address</th>
              <th>Payment</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={order.id}>
                <td>{index + 1}</td>
                <td>{order.customerName}</td>
                <td>
                  {order.items.map((item) => (
                    <div key={item.id}>
                      {item.recipeName} (x{item.quantity})
                    </div>
                  ))}
                </td>
                <td>{order.address}</td>
                <td>{order.paymentMethod}</td>
                <td>
                  <Badge
                    bg={
                      order.status === 'pending'
                        ? 'warning'
                        : order.status === 'preparing'
                        ? 'primary'
                        : 'success'
                    }
                  >
                    {order.status}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default Orders;
