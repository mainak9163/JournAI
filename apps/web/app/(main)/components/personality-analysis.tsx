import { BookOpen, Brain, Briefcase, TrendingUp, UserCircle } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

//@ts-expect-error analysis type needs to be added TODO
const PersonalityAnalysis = ({ analysis }) => {
  // This would normally come from props or context
  //   const analysis = {
  //     "id": "cm77gsges0001070vl0xn5b4m",
  //     "createdAt": "2025-02-16T10:09:11.189Z",
  //     "updatedAt": "2025-02-16T10:09:11.189Z",
  //     "entryId": "cm6xbt6gb0001zu0wel3850nj",
  //     "userId": "cm68se39n0000yu0w8uepb9md",
  //     "openness": 50,
  //     "conscientiousness": 50,
  //     "extraversion": 25,
  //     "agreeableness": 75,
  //     "neuroticism": 50,
  //     "mbtiType": "ISFJ",
  //     "mbtiDescription": "ISFJs are known for their warm, supportive, and practical nature. They are often described as loyal, responsible, and caring individuals who value tradition and stability. In the journal entry, the writer's focus on expressing emotions and desires, as well as their concern for the well-being of others, aligns with the characteristics of an ISFJ personality type.",
  //     "strengths": [
  //       "Compassion",
  //       "Empathy",
  //       "Loyalty",
  //       "Responsibility",
  //       "Practicality"
  //     ],
  //     "growthAreas": [
  //       "Self-confidence",
  //       "Assertiveness",
  //       "Openness to new experiences",
  //       "Emotional resilience",
  //       "Time management"
  //     ],
  //     "careerSuggestions": [
  //       "Social work",
  //       "Counseling",
  //       "Teaching",
  //       "Nursing",
  //       "Administrative support"
  //     ]
  //   };

  if (!analysis) return <></>;

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Prepare data for the personality traits chart
  const traitsData = [
    { name: "Openness", value: analysis.openness },
    { name: "Conscientiousness", value: analysis.conscientiousness },
    { name: "Extraversion", value: analysis.extraversion },
    { name: "Agreeableness", value: analysis.agreeableness },
    { name: "Neuroticism", value: analysis.neuroticism },
  ];

  // Function to download analysis as JSON
  // const downloadAnalysis = () => {
  //   // Create a blob with the JSON data
  //   const jsonString = JSON.stringify(analysis, null, 2);
  //   const blob = new Blob([jsonString], { type: "application/json" });

  //   // Create a temporary URL for the blob
  //   const url = URL.createObjectURL(blob);

  //   // Create a temporary link element
  //   const link = document.createElement("a");
  //   link.href = url;
  //   link.download = `personality-analysis-${analysis.id}.json`;

  //   // Append to body, click, and remove
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);

  //   // Release the URL
  //   URL.revokeObjectURL(url);
  // };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-background text-foreground rounded-lg shadow-lg">
      {/* Header Section with Download Button */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UserCircle className="h-12 w-12 text-primary mr-4" />
          <div>
            <h1 className="text-2xl font-bold">Personality Analysis</h1>
            <p className="text-muted-foreground">Created on {formatDate(analysis.createdAt)}</p>
          </div>
        </div>
        {/* <button
          onClick={downloadAnalysis}
          className="flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          <Download className="h-4 w-4 mr-2" />
          Download
        </button> */}
      </div>

      {/* MBTI Section */}
      <div className="mb-8 bg-card text-card-foreground p-6 rounded-lg border border-border">
        <div className="flex items-center mb-4">
          <Brain className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold">MBTI Profile: {analysis.mbtiType}</h2>
        </div>
        <p className="leading-relaxed">{analysis.mbtiDescription}</p>
      </div>

      {/* Personality Traits Chart */}
      <div className="mb-8 bg-card text-card-foreground p-6 rounded-lg border border-border">
        <div className="flex items-center mb-4">
          <BookOpen className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold">Personality Traits</h2>
        </div>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={traitsData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--foreground))" }} />
              <YAxis dataKey="name" type="category" width={150} tick={{ fill: "hsl(var(--foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  color: "hsl(var(--popover-foreground))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Growth Areas */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Strengths</h2>
          </div>
          <ul className="space-y-2">
            {analysis.strengths.map((strength: string, index: number) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={index} className="flex items-center">
                <span className="h-2 w-2 bg-primary rounded-full mr-2" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-6 w-6 text-primary mr-2" />
            <h2 className="text-xl font-semibold">Growth Areas</h2>
          </div>
          <ul className="space-y-2">
            {analysis.growthAreas.map((area: string, index: number) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <li key={index} className="flex items-center">
                <span className="h-2 w-2 bg-primary rounded-full mr-2" />
                <span>{area}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Career Suggestions */}
      <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
        <div className="flex items-center mb-4">
          <Briefcase className="h-6 w-6 text-primary mr-2" />
          <h2 className="text-xl font-semibold">Career Suggestions</h2>
        </div>
        <div className="flex flex-wrap gap-4">
          {analysis.careerSuggestions.map((career: string, index: number) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <div key={index} className="bg-accent text-accent-foreground p-2 px-4 rounded-md w-fit">
              <span>{career}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PersonalityAnalysis;
