// External packages
import { isMobile, useWallet } from "@aptos-labs/wallet-adapter-react";
import { useEffect, useState } from "react";
// Internal utils
import { aptosClient } from "@/utils/aptosClient";
// Internal components
import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
// Entry functions
import { MODULE_ADDRESS } from "@/constants";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { DatePicker, Form, message, Select, Table } from "antd";
import moment from "moment";
import { Layout } from "antd";

const { Column } = Table;
const { Footer } = Layout;

export function CreateCollection() {
  // Wallet Adapter provider
  const { account, signAndSubmitTransaction } = useWallet();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [createdScholarships, setCreatedScholarships] = useState<Scholarship[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [transactionHash, setTransactionHash] = useState<any>(null);
  const [scholarshipId, setScholarshipId] = useState<number>(0);

  useEffect(() => {
    fetchBalance();
    fetchAllScholarships();
    fetchAllScholarshipsCreatedByAddress();
  }, []);

  interface Scholarship {
    name: string;
    amount_per_applicant: number;
    total_applicants: number;
    criteria_gpa: number;
    field_of_study: string;
    end_time: number;
    is_open: boolean;
    recipients: string[];
    scholarship_id: number;
  }

  interface DistributeScholarship {
    scholarship_id: number;
  }

  interface ScholarshipFormData {
    name: string;
    amount_per_applicant: number;
    total_applicants: number;
    criteria_gpa: number;
    field_of_study: string;
    end_time: number;
    scholarship_id: number;
  }

  const disabledDateTime = () => {
    const now = moment();
    return {
      disabledHours: () => [...Array(24).keys()].slice(0, now.hour()),
      disabledMinutes: (selectedHour: number) => {
        if (selectedHour === now.hour()) {
          return [...Array(60).keys()].slice(0, now.minute());
        }
        return [];
      },
      disabledSeconds: (selectedHour: number, selectedMinute: number) => {
        if (selectedHour === now.hour() && selectedMinute === now.minute()) {
          return [...Array(60).keys()].slice(0, now.second());
        }
        return [];
      },
    };
  };

  function formatTimestamp(timestamp: number) {
    const date = new Date(Number(timestamp * 1000));
    const day = String(date.getDate()).padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const returnDate = `${day} ${month} ${year} ${hours}:${minutes}`;

    return returnDate;
  }

  const disabledDate = (current: any) => {
    // Can not select days before today and today
    return current && current < moment().endOf("day");
  };

  const initializeBalance = async () => {
    try {
      if (!account) throw new Error("Please connect your wallet");
      const response = await signAndSubmitTransaction({
        sender: account.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::initialize_balance`,
          functionArguments: [],
        },
      });
      message.success("Balance initialized successfully!");
      await aptosClient().waitForTransaction({ transactionHash: response.hash });
      setTransactionHash(response.hash);
      console.log("Balance initialized!");
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        console.error("Transaction rejected by user. You Already Initialized Balance");
        message.error("Transaction rejected by user. You Already Initialized Balance");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
    }
  };

  const createScholarship = async (values: ScholarshipFormData) => {
    setTransactionHash(null);
    try {
      const datePicker = values.end_time.toString();
      const timestamp = Date.parse(datePicker);
      const end_time = timestamp / 1000;
      const scholarship_id = 1000 + scholarshipId;
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::create_scholarship`,
          functionArguments: [
            scholarship_id,
            values.name,
            values.amount_per_applicant,
            values.total_applicants,
            values.criteria_gpa,
            values.field_of_study,
            end_time,
          ],
        },
      });

      await aptosClient().waitForTransaction({ transactionHash: transaction.hash });
      setTransactionHash(transaction.hash);
      message.success("Scholarship created!");
      fetchAllScholarships();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error creating scholarship.", error);
    } finally {
    }
  };

  const fetchAllScholarships = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::ScholarshipPlatform::view_all_scholarships`,
      };

      const result = await aptosClient().view({ payload });

      if (result[0]) {
        if (Array.isArray(result[0])) {
          setScholarshipId(result[0].length);
        } else {
          setScholarshipId(0);
        }
      }

      const scholarshipsList = result[0] as Scholarship[];

      setScholarships(scholarshipsList);
      console.log(scholarships);
    } catch (error) {
      console.error("Failed to fetch scholarships:", error);
    } finally {
    }
  };

  const fetchAllScholarshipsCreatedByAddress = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::ScholarshipPlatform::view_all_scholarships_created_by_address`,
        functionArguments: [account?.address],
      };

      const result = await aptosClient().view({ payload });

      const scholarshipsList = result[0] as Scholarship[];

      setCreatedScholarships(scholarshipsList);
    } catch (error) {
      console.error("Failed to fetch scholarships:", error);
    } finally {
    }
  };

  const issueTokens = async () => {
    const issueAmt = 10000000000;

    const response = await signAndSubmitTransaction({
      sender: account?.address,
      data: {
        function: `${MODULE_ADDRESS}::ScholarshipPlatform::issue_tokens`,
        functionArguments: [issueAmt],
      },
    });
    message.success("tokens Issued successfully!");
    setBalance(balance + issueAmt);

    await aptosClient().waitForTransaction(response.hash);
  };

  const initializeScholarship = async () => {
    try {
      const response = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::initialize_scholarships`,
          functionArguments: [],
        },
      });
      message.success("Initialized Scholarship successfully!");

      await aptosClient().waitForTransaction(response.hash);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user. You already Initialized Scholarship");
        console.error("Transaction rejected by user. You already Initialized Scholarship");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
    }
  };

  const fetchBalance = async () => {
    try {
      const result = await aptosClient().view({
        payload: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::view_account_balance`,
          functionArguments: [account?.address],
        },
      });

      if (Array.isArray(result) && result.length > 0) {
        setBalance(Number(result[0]));
      } else {
        setBalance(0);
      }
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        console.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.error("Failed to get account balance:", error);
    }
  };

  const distributeScholarship = async (values: DistributeScholarship) => {
    setTransactionHash(null);
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::distribute_scholarship`,
          functionArguments: [values.scholarship_id],
        },
      });

      const txnHash = transaction?.hash;

      console.log(transaction?.hash);
      console.log(transaction);

      if (txnHash) {
        setTransactionHash(txnHash);
        console.log(transactionHash);
      }

      if (transaction?.hash) {
        const transactionResult = await aptosClient().waitForTransaction(transaction.hash);
        console.log(transactionResult);
        console.error("Scholarship Distributed successfully!");
      } else {
        throw new Error("Transaction hash is undefined");
      }
      message.success("Scholarship has been Distributed!");
      fetchAllScholarships();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error distributing scholarship.", error);
      console.error("Error distributing scholarship.");
    } finally {
    }
  };

  const emergency_close_scholarship = async (values: DistributeScholarship) => {
    setTransactionHash(null);
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::emergency_close_scholarship`,
          functionArguments: [values.scholarship_id],
        },
      });

      const txnHash = transaction?.hash;

      console.log(transaction?.hash);
      console.log(transaction);

      if (txnHash) {
        setTransactionHash(txnHash);
        console.log(transactionHash);
      }

      if (transaction?.hash) {
        const transactionResult = await aptosClient().waitForTransaction(transaction.hash);
        console.log(transactionResult);
        message.success("Scholarship Closed successfully!");
      } else {
        throw new Error("Transaction hash is undefined");
      }
      message.success("Scholarship has been Closed and Your money refunded!");
      fetchAllScholarships();
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        console.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error Closing scholarship.", error);
      message.error("Error Closing scholarship.");
    } finally {
    }
  };

  return (
    <>
      <LaunchpadHeader title="Create Scholarships" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Setup Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Setup</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Initial Setup</h3>
                      <CardDescription>One-time setup required for scholarship creation</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button 
                      variant="init" 
                      size="sm" 
                      className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md" 
                      onClick={initializeBalance}
                    >
                      Initialize Balance
                    </Button>
                    <Button 
                      variant="init" 
                      size="sm" 
                      className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md" 
                      onClick={issueTokens}
                    >
                      Issue Tokens
                    </Button>
                    <Button 
                      variant="init" 
                      size="sm" 
                      className="text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-md" 
                      onClick={initializeScholarship}
                    >
                      Init Scholarship
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">💰</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Account Balance</h3>
                      <CardDescription>Available tokens for scholarship funding</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    {balance !== 0 ? (
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-blue-600">{balance.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">Tokens</span>
                      </div>
                    ) : (
                      <div className="text-gray-500">Please initialize your balance first</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Scholarship Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Scholarship</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">✏️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Scholarship Details</h3>
                    <CardDescription>Fill in the details for your new scholarship</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form
                  onFinish={createScholarship}
                  labelCol={{
                    span: 6.2,
                  }}
                  wrapperCol={{
                    span: 100,
                  }}
                  layout="horizontal"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.Item name="name" label="Scholarship Name" rules={[{ required: true }]}>
                      <Input placeholder="Enter scholarship name" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="amount_per_applicant" label="Amount Per Applicant" rules={[{ required: true }]}>
                      <Input placeholder="Enter amount per applicant" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="total_applicants" label="Total Applicants" rules={[{ required: true }]}>
                      <Input placeholder="Enter total number of applicants" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="criteria_gpa" label="Minimum GPA" rules={[{ required: true }]}>
                      <Input placeholder="Enter minimum GPA requirement" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="field_of_study" label="Field of Study" rules={[{ required: true }]}>
                      <Select placeholder="Select field of study" className="rounded-lg">
                        <Select.Option value="Science">Science</Select.Option>
                        <Select.Option value="Maths">Maths</Select.Option>
                        <Select.Option value="Computer">Computer</Select.Option>
                        <Select.Option value="Sports">Sports</Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                      </Select>
                    </Form.Item>
                    <Form.Item name="end_time" label="End Time" rules={[{ required: true }]}>
                      <DatePicker
                        showTime={isMobile() ? false : true}
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        getPopupContainer={(trigger) => trigger.parentElement || document.body}
                        popupClassName="max-w-full sm:max-w-lg"
                        className="w-full rounded-lg"
                        placeholder="Select end date and time"
                      />
                    </Form.Item>
                  </div>
                  <Form.Item className="pt-4">
                    <Button 
                      variant="submit" 
                      size="lg" 
                      className="text-base w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg" 
                      type="submit"
                    >
                      Create Scholarship
                    </Button>
                  </Form.Item>
                </Form>
              </CardContent>
            </Card>
          </div>
          {/* Your Scholarships Table */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Created Scholarships</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table 
                    dataSource={createdScholarships} 
                    rowKey="scholarship_id" 
                    className="w-full"
                    pagination={{ pageSize: 10 }}
                  >
                    <Column title="ID" dataIndex="scholarship_id" width={80} />
                    <Column title="Name" dataIndex="name" width={200} />
                    <Column title="Amt / A" dataIndex="amount_per_applicant" responsive={["lg"]} width={120} />
                    <Column title="Total A" dataIndex="total_applicants" responsive={["lg"]} width={100} />
                    <Column title="GPA Req" dataIndex="criteria_gpa" width={100} />
                    <Column title="Field" dataIndex="field_of_study" responsive={["md"]} width={120} />
                    <Column
                      title="Status"
                      dataIndex="is_open"
                      render={(is_open: boolean) => (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          is_open ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {is_open ? "Open" : "Closed"}
                        </span>
                      )}
                      responsive={["md"]}
                      width={100}
                    />
                    <Column
                      title="End Time"
                      dataIndex="end_time"
                      render={(time: any) => (
                        <span className="text-sm text-gray-600">
                          {formatTimestamp(time).toString()}
                        </span>
                      )}
                      responsive={["lg"]}
                      width={180}
                    />
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Management Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">🎯</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Distribute Scholarship</h3>
                    <CardDescription>Distribute funds to eligible recipients after deadline</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form
                  onFinish={distributeScholarship}
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item name="scholarship_id" label="Scholarship ID" rules={[{ required: true }]}>
                    <Input placeholder="Enter scholarship ID" className="rounded-lg" />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      variant="submit" 
                      size="lg" 
                      className="text-base w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg" 
                      type="submit"
                    >
                      Distribute Funds
                    </Button>
                  </Form.Item>
                </Form>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">⚠️</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Emergency Close</h3>
                    <CardDescription>Close scholarship early and get refund</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form
                  onFinish={emergency_close_scholarship}
                  layout="vertical"
                  className="space-y-4"
                >
                  <Form.Item name="scholarship_id" label="Scholarship ID" rules={[{ required: true }]}>
                    <Input placeholder="Enter scholarship ID" className="rounded-lg" />
                  </Form.Item>
                  <Form.Item>
                    <Button 
                      variant="submit" 
                      size="lg" 
                      className="text-base w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg" 
                      type="submit"
                    >
                      Close Scholarship
                    </Button>
                  </Form.Item>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer className="footer bg-gray-800 text-white">
        <div className="text-center py-4">
          <span className="text-sm">AptScholar@2025 | All Rights Reserved</span>
        </div>
      </Footer>
    </>
  );
}
