import React, { useState, useEffect, useRef } from "react";
import { Form, Col, Button, Row } from "react-bootstrap";
import axios from "axios";
import { useFormik } from "formik";
import { useHistory, Redirect } from "react-router-dom";
import { getCellars, getCellar, cleanCellar } from "../store/actions/index";
import { connect } from "react-redux";
import UDTable from "./UDTable";
import ModalDelete, {ErrorModal} from "./ModalDelete";
function FormCellar({ cellars, cellar, getCellars, getCellar, id, edit, cleanCellar, admin }) {
	const history = useHistory();
	const [errModal, throwErrModal] = useState({ show:false });
	const [modalDelete, throwModal] = useState({
		show: false,
		dialog: "",
	});
	const [handle, setHandle] = useState("add");
	const formik = useFormik({
		initialValues: { name: "" },
		validate: values => {
			const errors = {};
			!values.name && (errors.name = "se requiere nombre");
			return errors;
		},
		onSubmit: values => handleSubmit(values),
	});
	useEffect(() => {
		if (!id) return;
		getCellar(id);
		setHandle("edit");
	}, [id]);
	// Cuando monta el componente, trae todos los celars.
	useEffect(() => {
		getCellars();
		document.body.id="bg_form";
		return () => {
			cleanCellar();
		};
	}, []);
	// Si recibe id, se fija si edit es true, y cambia el nombre del botón
	useEffect(() => {
		handle === "edit" && cellar && formik.setValues(cellar, false);
	}, [handle, cellar]);
	function handleSubmit(values) {
		if (id) {
			axios
				.put(`http://localhost:3001/cellar_private/${id}`, values, { withCredentials: true })
				.then(() => {
					getCellars();
					history.replace("/admin/formCellar");
				})
				.catch(err => console.log("error", err));
			return;
		}
		const url = "http://localhost:3001/cellar_private";
		axios
			.post(url, values, { withCredentials: true })
			.then(res => {
				getCellars();
				formik.resetForm({ name: "" });
			})
			.catch(e => console.log(e));
	}
	function eliminar(id) {
		axios
			.delete(`http://localhost:3001/cellar_private/${id}`, { withCredentials: true })
			.then(() => {
				getCellars();
				throwModal({ ...modalDelete, show: false });
			})
			.catch(err => {
				console.log(err);
				throwModal({ ...modalDelete, show: false });
				throwErrModal({ ...errModal, show: true, msg: err.response.data });
			});
	}
	if (!admin) return <Redirect to="/login" />;
	return (
		<div id="main" style={{ textAlign: "right" }}>
			<ModalDelete
				show={modalDelete.show}
				dialog={modalDelete.dialog}
				header={modalDelete.header}
				pk={modalDelete.pk}
				cancel={() => throwModal({ ...modalDelete, show: false })}
				commit={eliminar}
			/>
			<ErrorModal
				show={errModal.show}
				msg={errModal.msg}
				close={() => throwErrModal({ ...errModal, show:false })}
			/>
			<Form style={{ width: "25rem", marginTop: "8rem", marginBottom: "2rem" }} onSubmit={formik.handleSubmit}>
				<Form.Group as={Row}>
					<Form.Label column sm="2">
						Bodega
					</Form.Label>
					<Col sm="10">
						<Form.Control
							value={formik.values.name}
							placeholder="Bodega"
							onChange={e => formik.setFieldValue("name", e.target.value)}
							isInvalid={!!formik.errors.name}
						/>
						<Form.Control.Feedback type="invalid" tooltip>
							{formik.errors.name && formik.errors.name}
						</Form.Control.Feedback>
					</Col>
				</Form.Group>
				<Button variant="primary" type="submit">
					{handle === "edit" ? "Actualizar" : "Agregar"}
				</Button>
				{handle === "edit" && (
					<Button variant="secondary" onClick={() => history.replace("/admin/formCellar")}>
						Cancelar
					</Button>
				)}
			</Form>
			<UDTable
				headers={["#", "Nombre"]}
				rows={cellars}
				attributes={["id", "name"]}
				update="/admin/formCellar/edit"
				updatePk="id"
				deletePk="id"
				handleDelete={id => {
					throwModal({
						show: true,
						dialog: "La bodega con Pk " + id + " será eliminada.\n¿Desea continuar?",
						header: "Eliminar bodega",
						pk: id,
					});
				}}
			/>
		</div>
	);
}
export default connect(({ cellar, cellars, admin }) => ({ cellar, cellars, admin }), {
	getCellar,
	getCellars,
	cleanCellar,
})(FormCellar);
