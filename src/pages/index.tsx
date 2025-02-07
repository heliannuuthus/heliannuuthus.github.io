import Annuus from "@site/src/pages/_annuus";
import Layout from "@theme/Layout";
import Declaration from "@site/src/pages/_declaration";
import { Title } from "@site/src/components/Typography";

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
          flexDirection: "column",
        }}
      >
        <div
          style={{
            margin: "130px 0 100px 0",
          }}
        >
          <Annuus />
          <Title level={1} style={{ marginTop: "48px" }}>
            heliannuuthus
          </Title>
        </div>
        <Declaration />
      </div>
    </Layout>
  );
}
