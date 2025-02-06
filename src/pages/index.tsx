import Annuus from "./_annuus";
import Layout from "@theme/Layout";

export default function Home() {
  return (
    <Layout>
      <div
        className="annuus-container"
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Annuus />
      </div>
    </Layout>
  );
}
