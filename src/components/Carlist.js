import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Addcar from './Addcar';
import Editcar from './Editcar';

export default function Carlist() {
    const [cars, setCars] = useState([]);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => fetchData(), []);

    const fetchData = () => {
        fetch('https://carstockrest.herokuapp.com/cars')
        .then(response => response.json())
        .then(data => setCars(data._embedded.cars))
        .catch(err => console.error(err))
    }

    const deleteCar = (link) => {
        if(window.confirm('Are you sure?')) {
        fetch(link, {method: 'DELETE'})
        .then(res => fetchData())
        .catch(err => console.log(err))
        setOpen(true);
        setMessage('Car deleted');
        }
    }

    const saveCar = (car) => {
        fetch('https://carstockrest.herokuapp.com/cars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
    })
        .then(res => fetchData())
        .catch(err => console.error(err))
        setOpen(true);
        setMessage('New car saved');
    }

    const editCar = (car, link) => {
        fetch(link, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(car)
        })
        .then(res => fetchData())
        .catch(err => console.error(err))
        setOpen(true);
        setMessage('Data edited');

    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    }

    const columns = [
        {
            Header: 'Brand',
            accessor: 'brand'
        },
        {
            Header: 'Model',
            accessor: 'model'
        },
        {
            Header: 'Color',
            accessor: 'color'
        },
        {
            Header: 'Fuel',
            accessor: 'fuel'
        },
        {
            Header: 'Year',
            accessor: 'year'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            filterable: false,
            sortable: false,
            width: 100,
            Cell: row => <Editcar editCar={editCar} car={row.original} />
        },
        {
            sortable: false,
            filterable: false,
            width: 100,
            accessor: '_links.self.href',
            Cell: row => <Button variant='outlined' color='secondary' size='small' onClick={() => deleteCar(row.value)}>Delete</Button>
        }
    ]

    return (
        <div>
            <Addcar saveCar={saveCar}/>
            <ReactTable filterable={true} data={cars} columns={columns} />
            <Snackbar
                anchorOrigin={{
                    vertical:'bottom',
                    horizontal: 'left'
                }}
                open={open}
                autoHideDuration={6000}
                message={message}
                onClose={handleClose}
                action={
                    <IconButton size='small' aria-label='close' color='inherit' onClick={handleClose}>
                        <CloseIcon fontSize='small'/>
                    </IconButton>
                }
                />
        </div>
    )
}