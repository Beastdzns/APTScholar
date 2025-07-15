import { LaunchpadHeader } from "@/components/LaunchpadHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { MODULE_ADDRESS } from "@/constants";
import { aptosClient } from "@/utils/aptosClient";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Form, Input, message, Select, Table } from "antd";
import "dotenv/config";
import { useEffect, useState } from "react";
const { Column } = Table;
import { Layout } from "antd";

const { Footer } = Layout;

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

interface ApplyScholarship {
  scholarship_id: number;
  criteria_gpa: number;
  field_of_study: string;
}

export function MyCollections() {
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [appliedScholarships, setAppliedScholarships] = useState<{ appliedScholarshipIDS: string }[] | null>(null);

  const { account, signAndSubmitTransaction } = useWallet();

  useEffect(() => {
    fetchAllScholarships();
    view_all_scholarships_applied_by_address();
  }, []);

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

  const fetchAllScholarships = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::ScholarshipPlatform::view_all_scholarships`,
      };

      const result = await aptosClient().view({ payload });

      const scholarshipsList = result[0] as Scholarship[];

      setScholarships(scholarshipsList);
    } catch (error) {
      console.error("Failed to fetch scholarships:", error);
    } finally {
    }
  };

  const applyScholarship = async (values: ApplyScholarship) => {
    try {
      const transaction = await signAndSubmitTransaction({
        sender: account?.address,
        data: {
          function: `${MODULE_ADDRESS}::ScholarshipPlatform::apply_for_scholarship`,
          functionArguments: [values.scholarship_id, values.criteria_gpa, values.field_of_study],
        },
      });

      console.log("Transaction:", transaction);
      message.success(`Successfully To Scholarship! ${values.scholarship_id}`);

      fetchAllScholarships(); // Refresh scholarships
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        // Standard error code for user rejection
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.log("Error applying scholarship.", error);
    }
  };

  const view_all_scholarships_applied_by_address = async () => {
    try {
      const payload: InputViewFunctionData = {
        function: `${MODULE_ADDRESS}::ScholarshipPlatform::view_all_scholarships_applied_by_address`,
        functionArguments: [account?.address],
      };

      const result = await aptosClient().view({ payload });

      console.log("all scholarships applied by address:", result);

      const scholarshipIDS = result.map((scholarshipIDS) => ({
        appliedScholarshipIDS: String(scholarshipIDS),
        // gpa: 3.5, // Placeholder for GPA (or fetch from another function if available)
      }));

      setAppliedScholarships(scholarshipIDS as { appliedScholarshipIDS: string }[]);
      console.log("Applicant Data:", scholarshipIDS);
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && (error as { code: number }).code === 4001) {
        // Standard error code for user rejection
        message.error("Transaction rejected by user.");
      } else {
        if (error instanceof Error) {
          console.error(`Transaction failed: ${error.message}`);
        } else {
          console.error("Transaction failed: Unknown error");
        }
        console.error("Transaction Error:", error);
      }
      console.error("Failed to get applied Scholarship ids:", error);
    }
  };

  return (
    <>
      <LaunchpadHeader title="Apply for Scholarship" />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Available Scholarships Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Scholarships</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📚</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Scholarship Opportunities</h3>
                    <CardDescription>Browse all available scholarships on the platform</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="overflow-x-auto">
                  <Table 
                    dataSource={scholarships} 
                    rowKey="scholarship_id" 
                    className="w-full"
                    pagination={{ pageSize: 10 }}
                  >
                    <Column title="ID" dataIndex="scholarship_id" width={80} />
                    <Column title="Name" dataIndex="name" width={200} />
                    <Column
                      title="Donor"
                      dataIndex="donor"
                      render={(donor: string) => (
                        <span className="text-sm text-gray-600">{donor?.substring(0, 6)}...</span>
                      )}
                      responsive={["lg"]}
                      width={100}
                    />
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
          {/* Application Form Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Apply for Scholarship</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📝</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Submit Application</h3>
                    <CardDescription>Fill out the form to apply for a scholarship</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Form
                  onFinish={applyScholarship}
                  layout="vertical"
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Form.Item name="scholarship_id" label="Scholarship ID" rules={[{ required: true }]}>
                      <Input placeholder="Enter scholarship ID" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="criteria_gpa" label="Your GPA" rules={[{ required: true }]}>
                      <Input placeholder="Enter your GPA" className="rounded-lg" />
                    </Form.Item>
                    <Form.Item name="field_of_study" label="Field of Study" rules={[{ required: true }]}>
                      <Select placeholder="Select your field of study" className="rounded-lg">
                        <Select.Option value="Science">Science</Select.Option>
                        <Select.Option value="Maths">Maths</Select.Option>
                        <Select.Option value="Computer">Computer</Select.Option>
                        <Select.Option value="Sports">Sports</Select.Option>
                        <Select.Option value="Others">Others</Select.Option>
                      </Select>
                    </Form.Item>
                  </div>
                  <Form.Item className="pt-4">
                    <Button 
                      variant="submit" 
                      size="lg" 
                      className="text-base w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg" 
                      type="submit"
                    >
                      Apply for Scholarship
                    </Button>
                  </Form.Item>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Applied Scholarships Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Applications</h2>
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">📋</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Applied Scholarships</h3>
                    <CardDescription>Track all your scholarship applications</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                {appliedScholarships && appliedScholarships.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {appliedScholarships.map((applicant, i) => (
                      <div key={i} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{i + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">Scholarship ID</p>
                            <p className="text-blue-600 font-medium">{applicant.appliedScholarshipIDS}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-gray-400 text-2xl">📝</span>
                    </div>
                    <p className="text-gray-500">No scholarship applications yet</p>
                    <p className="text-sm text-gray-400">Apply for scholarships to see them here</p>
                  </div>
                )}
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
