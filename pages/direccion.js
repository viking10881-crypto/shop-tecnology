import withAuth from "../utils/withAuth";

function Direccion() {
  return <h1>Tus direcciones</h1>;
}

export default withAuth(Direccion);
