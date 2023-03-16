import { useEffect, useState } from "react";

interface Item {
  id: number;
  name: string;
  price: number;
}

interface InputProps {
  items?: Item[];
  invoice?: Boolean;
  shippingCost?: number;
  // change to not optional later
}

export default function ItemsTable({ items, invoice, shippingCost=0 }: InputProps) {
  // { items }: InputProps
  const data: Item[] = [
    {
      id: 1,
      name: "item 1",
      price: 0,
    },
    {
      id: 2,
      name: "item 2",
      price: 0,
    },
    {
      id: 3,
      name: "item 3",
      price: 10,
    },
  ];

  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const total = data.reduce(
      (accumulator, currentItem) => accumulator + currentItem.price,
      0
    );
    setTotalPrice(total+shippingCost);
  }, []);

  const formattedPrice = totalPrice.toLocaleString("en-US", {
    style: "currency",
    currency: "CAD",
  });

  const rows = data.map((item) => (
    <tr key={item.id}>
      <td>{item.name}</td>
      <td>{'$' + item.price}</td>
    </tr>
  ));

  rows.push(
    <tr>
      <th scope="row">Shipping</th>
      <td>{'$' + shippingCost}</td>
    </tr>
  );

  return (
    <div className="items table-responsive">
      <table className="table table-hover table-borderless">
        <thead>
          <tr>
            <th scope="col">Item</th>
            <th scope="col">Price</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          {invoice && (
            <tr className="table-group-divider">
              <th scope="row">Subtotal</th>
              <td>{formattedPrice}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}