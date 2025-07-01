// ✅ Corrected List.jsx
import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import './List.css';

const List = ({ url }) => {
  const [list, setList] = useState([]);

  const fetchList = async () => {
    try {
      const response = await axios.get(`${url}/api/food`);
      setList(response.data);
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const removeFood = async (id) => {
    try {
      const response = await axios.delete(`${url}/api/food/remove?id=${id}`);
      toast.success(response.data.message);
      fetchList();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='list screen flex-col'>
      <p>All Food List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <p><b>Item</b></p>
          <p><b>Name</b></p>
          <p><b>Price</b></p>
          <p><b>Remove</b></p>
          
        </div>
        {list.map((item, index) => (
          <div key={index} className="list-table-format">
            <img
              src={`${url}/images/${item.image}`}
              alt={item.name}
              onError={(e) => (e.target.style.display = 'none')}
            />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>₹{item.price}</p>
            <p className="cursor" onClick={() => removeFood(item._id)}>X</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default List;
