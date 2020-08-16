import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { matchPath } from "react-router-dom";
import "../styles/FormProduct.css";
import axios from "axios";
export default function FormProduct() {
	const [data, setData] = useState({
		cellar: [],
		strain: [],
		category: [],
	});

	// Para que asigne el primer cellar por defecto. FALLA porque no encuentra data.cellar[0].id
	// useEffect(() => {
	// 	fetch("http://localhost:3000/cellar")
	// 		.then(r => r.json())
	// 		.then(cellar => {
	// 			setInputs({ ...inputs, cellarId: data.cellar[0].id });
	// 			setData({ ...data, cellar });
	// 		});
	// }, []);

	const [inputs, setInputs] = useState({
		name: "",
		description: "",
		price: "",
		stock: "",
		//img: "",
		//categoryId: "",
		cellarId: "",
		// strainId: "",
		active: true,
		//nombreBoton: "Agregar",
	});
	// var nombreBoton = "Agregar";

	// Esto se ejecuta cuando se selecciona una categoría
	useEffect(() => {
		fetch("http://localhost:3000/strain")
			.then(r => r.json())
			.then(strain => setData({ ...data, strain }));
		// }, [inputs.categoryId]);
	}, []);
	useEffect(() => {
		fetch("http://localhost:3000/category")
			.then(r => r.json())
			.then(category => setData({ ...data, category }));
		fetch("http://localhost:3000/cellar")
			.then(r => r.json())
			.then(cellar => setData({ ...data, cellar }));
	}, []);
	function handleSubmit(e) {
		e.preventDefault();
		//fetch a la api :
		const url = "http://localhost:3000/products";
		axios
			.post(url, inputs)
			.then(res => {
				console.log("success", res);
			})
			.catch(err => console.log("error", err));
	}
	return (
		<Form style={{ width: "50rem", margin: "auto" }} id="formulario" onSubmit={e => handleSubmit(e)}>
			<Form.Group>
				<Form.Label>Nombre de producto: </Form.Label>
				<Form.Control value={inputs.name} placeholder="Nombre" onChange={e => setInputs({ ...inputs, name: e.target.value })} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Precio de producto: </Form.Label>
				<Form.Control type="number" step="0.01" placeholder="Precio" onChange={e => setInputs({ ...inputs, price: e.target.value })} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Descripción del producto:</Form.Label>
				<Form.Control as="textarea" placeholder="Descripción" onChange={e => setInputs({ ...inputs, description: e.target.value })} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Imagen</Form.Label>
				<Form.Control placeholder="Link a Imagen" onChange={e => setInputs({ ...inputs, img: e.target.value })} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Stock del producto: </Form.Label>
				<Form.Control placeholder="Cantidad" onChange={e => setInputs({ ...inputs, stock: e.target.value })} />
			</Form.Group>
			<Form.Group>
				<Form.Label>Categorías</Form.Label>
				<Form.Control as="select" onChange={e => setInputs({ ...inputs, categoryId: parseInt(e.target.value) })}>
					{/*data.category.map(category => (
						<option value={category.id}>{category.name}</option>
					))*/}
				</Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Bodega</Form.Label>
				<Form.Control as="select" onChange={e => setInputs({ ...inputs, cellarId: parseInt(e.target.value) })}>
					{data.cellar.map(cellar => (
						<option value={cellar.id}>{cellar.name}</option>
					))}
				</Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Cepa</Form.Label>
				<Form.Control as="select" onChange={e => setInputs({ ...inputs, strainId: parseInt(e.target.value) })}>
					{/* {data.strain.map(strain => (
						<option value={strain.id}>{strain.name}</option>
					))} */}
				</Form.Control>
			</Form.Group>
			<Form.Group>
				<Form.Label>Estado de producto de tienda</Form.Label>
				<Form.Check type="checkbox" value="active_checkbox" onChange={e => setInputs({ ...inputs, active: e.target.value })} />
			</Form.Group>
			<Button variant="primary" type="submit">
				{inputs.nombreBoton}
			</Button>
		</Form>
	);
}
