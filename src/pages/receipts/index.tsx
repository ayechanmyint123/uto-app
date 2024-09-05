import { type NextPage } from "next";
import { Layout } from "../../components";
import { ReceiptTable } from "~/components/receipts";

const Receipts: NextPage = () => {
  return (
    <Layout title="Receipts">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <ReceiptTable/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Receipts;
