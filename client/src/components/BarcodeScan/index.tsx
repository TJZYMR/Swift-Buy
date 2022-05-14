import { faIndianRupeeSign } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useCallback, useEffect, useMemo } from 'react'
import { Button, Table } from 'react-bootstrap';
import BarcodeScannerComponent from 'react-qr-barcode-scanner';
import { Link } from 'react-router-dom';

const BarcodeScan: React.FC = () => {
    const [data, setData] = React.useState<string>("Not data Found");
    const [tableData, setTableData] = React.useState<any[]>([]);
    const [priceTotal, setPriceTotal] = React.useState<any>();
    let demoData : any = {
        '3748721110': {
            name: 'Butter milk',
            price: 12
        },
        '4728495837': {
            name: 'Ice Cream',
            price: 20
        },
        '6849526349':{
          name:'Red Bull',
          price: 120
        },
        '3147392857': {
            name: 'Lays',
            price: 30
        },
        '4729475256': {
            name: 'Maggi',
            price: 20
        }
    };


    const keys = Object.keys(demoData);

useEffect(() => {
    // keys.forEach((key, index) => {
        
    //     if(key == data){
    //         setTableData([demoData[key]])
    //     }
    //     console.log(tableData);
    // })
}, [])

const add = useCallback((accumulator:any, a:any) => {
    console.log("a", a, accumulator);
    
    return accumulator + a;
},[])
let sumPrice: any = [];
const scan = useCallback(
  (err, result) => {
    if (result){
        

        keys.forEach((key, index) => {
            if(key == result?.text){
                console.log("demoData[key].price", demoData[key].price);
                sumPrice.push(demoData[key].price)
                let test = tableData.splice(tableData.length, 0, demoData[key]);
                setTableData([...tableData, test])
            }
           
        });
        console.log(sumPrice);
        let total = sumPrice.reduce(add, 0);
        setPriceTotal(total)
        localStorage.setItem('priceTotal', total)
                console.log("DD",total);
    }
   
   
  },
  [setTableData, setPriceTotal],
)
    


    return (
        <div>
            <>
      <BarcodeScannerComponent
        width={500}
        height={500}
        onUpdate={(err, result :any) => {
            if (result) {scan && scan(err, result);}
        }}
      />
      {/* <p>{data}</p> */}
    </>
    <Table striped bordered hover>
  <thead>
    <tr>
      <th>Item Name</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
      {tableData && tableData.map((item:any) => (
        <tr>
      <td>{item.name}</td>
      <td>{item.price}</td>
    </tr>
      ))}
    
    
    </tbody>
    </Table>
    <Link to={'/payment'}><Button>Pay   <FontAwesomeIcon color='white' size='sm' className='right-arrow'   icon={faIndianRupeeSign} />{priceTotal || 0}</Button></Link>
        </div>
    )
}

export default BarcodeScan