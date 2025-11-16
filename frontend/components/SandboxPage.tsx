import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus as darkStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { vs as lightStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Clock,
  Code,
  Loader2,
  CheckCircle,
  Square,
  Terminal,
  Settings,
  Share,
  Download,
  Play,
  Search,
  Copy,
  Globe
} from 'lucide-react';


interface SandboxPageProps {
  autoRun?: boolean;
}

export const SandboxPage: React.FC<SandboxPageProps> = ({ autoRun = false }) => {
  const [prompt, setPrompt] = useState('');
  const [steps, setSteps] = useState<any[]>([]);
  const [finalOutput, setFinalOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [codeOutput, setCodeOutput] = useState('');
  const [livePreview, setLivePreview] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [slides, setSlides] = useState([]);


  // Load prompt if saved
  useEffect(() => {
    const saved = localStorage.getItem('navaSandboxPrompt');
    if (saved) setPrompt(saved);
  }, []);

  const handleDownloadText = async (content: string, filename: string, type?: string) => {
    if (!content) return;

    if (type === 'pdf') {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF();
      doc.text(content, 10, 10);
      doc.save(filename);
      return;
    }

    if (type === 'docx') {
      const { Document, Packer, Paragraph } = await import('docx');
      const doc = new Document({
        sections: [{ properties: {}, children: [new Paragraph(content)] }],
      });
      const blob = await Packer.toBlob(doc);
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      return;
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  };

  const handleDownload = (imageUrl: string, filename: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.click();
  };

  const handleDownloadPPT = async (slidesData: any) => {
    const PptxGenJS = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    slidesData?.forEach((slide: any, i: number) => {
      const s = pptx.addSlide();
      s.addText(`Slide ${i + 1}`, { x: 1, y: 0.5, fontSize: 24, bold: true });
      s.addText(slide.text || slide, { x: 1, y: 1, fontSize: 18 });
    });

    pptx.writeFile({ fileName: 'slides_output.pptx' });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setSteps([]);
    setFinalOutput('');
    setCodeOutput('');
    setLivePreview('');
    setImageUrl(null);

    try {
      const backendUrl = (
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      ).replace(/\/$/, '');

      setSteps([
        {
          id: 1,
          title: 'Processing',
          description: ['Analyzing your request...'],
          icon: Play,
        },
      ]);

      const res = await fetch(`${backendUrl}/api/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      // ✅ Detect if it's a PPTX file before parsing
      const contentType = res.headers.get('Content-Type') || '';
      const fileType = res.headers.get('X-File-Type');

      if (
        contentType.includes('presentation') ||
        fileType === 'pptx' ||
        contentType.includes('application/vnd.openxmlformats')
      ) {
        console.log('📊 Detected PPTX file. Triggering download...');
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${prompt.replace(/\s+/g, '_').slice(0, 40)}.pptx`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        setSteps((prev) => [
          ...prev,
          {
            id: 2,
            title: '📊 PPT Ready',
            description: ['PowerPoint file downloaded successfully.'],
            icon: Play,
          },
        ]);

        setFinalOutput('✅ PowerPoint downloaded successfully!');
        return; // stop here to prevent JSON parsing
      }

      // 🧾 Otherwise parse JSON as usual
      const data = await res.json();
      console.log('🧩 Backend response:', data);

      // 🖼️ IMAGE HANDLING
      if (data.type === 'image') {
        const imageUrl = data.image_url || data.url;
        if (!imageUrl) throw new Error('Image URL missing from backend.');

        setSteps((prev) => [
          ...prev,
          {
            id: 2,
            title: '🖼️ Image Ready',
            description: ['Image generated successfully.'],
            icon: Play,
          },
        ]);

        setFinalOutput('');
        setCodeOutput('');
        setLivePreview('');
        setImageUrl(imageUrl);
        return;
      }

      // 🌐 WEBSITE HANDLING
      else if (data.type === 'website') {
        const htmlCode = data.html || data.code || data.output || '';
        setCodeOutput(htmlCode);
        setLivePreview(htmlCode);
        setSteps((prev) => [
          ...prev,
          {
            id: 2,
            title: '🌐 Website Ready',
            description: ['HTML/CSS/JS generated successfully.'],
            icon: Play,
          },
        ]);
      }

      // 💻 CODE HANDLING
      else if (data.type === 'code') {
        setCodeOutput(data.output || '');
        setSteps((prev) => [
          ...prev,
          {
            id: 2,
            title: '✅ Code Ready',
            description: ['Code generated successfully.'],
            icon: Play,
          },
        ]);
      }

      // 🧾 TEXT HANDLING
      else {
        setFinalOutput(data.output || JSON.stringify(data, null, 2));
      }
    } catch (err: any) {
      console.error('⚠️ Generation error:', err);
      setSteps((prev) => [
        ...prev,
        {
          id: 99,
          title: 'Error',
          description: [err.message || 'Unexpected error occurred.'],
          icon: Play,
        },
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const openWebsiteInNewTab = (htmlContent: string) => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const isDarkMode = () =>
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark');

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl mb-1">Sandbox</h1>
          {autoRun && <p>Auto-running your sandbox...</p>}
          <p className="text-muted-foreground">
            Experiment, test, and refine your AI prompts here
          </p>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden h-[calc(100vh-8rem)]">
        {/* Steps Panel */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 bg-muted/20 flex items-center justify-between">
            <h3 className="font-medium flex items-center">
              <Clock className="w-4 h-4 mr-2 text-[#7B61FF]" /> Generation Steps
            </h3>
            {isGenerating ? (
              <div className="flex items-center text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 mr-2 animate-spin text-[#7B61FF]" /> Generating...
              </div>
            ) : (
              <div className="text-sm text-green-500">Ready</div>
            )}
          </div>

          <div className="flex-1 p-6 bg-card/80 rounded-xl overflow-y-auto space-y-3 h-full">
            {steps.map((s) => (
              <div key={s.id} className="flex items-start space-x-2">
                <s.icon className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {s.description.join('\n')}
                  </p>
                </div>
              </div>
            ))}

            {/* Prompt input */}
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center space-x-3 bg-muted/30 rounded-lg p-3">
                <Search className="w-4 h-4 text-muted-foreground" />
                <Input
                  value={prompt}
                  onChange={(e) => {
                    setPrompt(e.target.value);
                    localStorage.setItem('navaSandboxPrompt', e.target.value);
                  }}
                  placeholder="Enter your prompt..."
                  className="flex-1 bg-transparent border-none focus:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGenerating) handleGenerate();
                  }}
                />
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] text-white"
                >
                  <Play className="w-3 h-3 mr-1" /> Generate
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* Output Panel */}
        <div className="w-1/2 flex flex-col overflow-hidden">
          <div className="p-4 bg-muted/20 flex justify-between items-center">
            <h3 className="font-medium flex items-center">
              <Code className="w-4 h-4 mr-2 text-[#7B61FF]" /> Output
            </h3>

            {/* ✅ Dynamic Action Buttons */}
            {livePreview ? (
              <Button
                onClick={() => openWebsiteInNewTab(livePreview)}
                variant="outline"
                className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
              >
                <Globe className="w-4 h-4 mr-2" /> Run Website
              </Button>
            ) : imageUrl ? (
              <Button
                onClick={() => handleDownload(imageUrl, 'generated_image.png')}
                variant="outline"
                className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
              >
                <Download className="w-4 h-4 mr-2" /> Download Image
              </Button>
            ) : finalOutput ? (
              <div className="flex space-x-2">
                <Button
                  onClick={() => handleDownloadText(finalOutput, 'output_text.pdf', 'pdf')}
                  variant="outline"
                  className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
                >
                  <Download className="w-4 h-4 mr-2" /> Download PDF
                </Button>
                <Button
                  onClick={() => handleDownloadText(finalOutput, 'output_text.docx', 'docx')}
                  variant="outline"
                  className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
                >
                  <Download className="w-4 h-4 mr-2" /> Download Word
                </Button>
              </div>
            ) : codeOutput ? (
              <Button
                onClick={() => handleDownloadText(codeOutput, 'generated_code.txt')}
                variant="outline"
                className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
              >
                <Download className="w-4 h-4 mr-2" /> Download Code
              </Button>
            ) : slides?.length > 0 ? (
              <Button
                onClick={() => handleDownloadPPT(slides)}
                variant="outline"
                className="text-white bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA]"
              >
                <Download className="w-4 h-4 mr-2" /> Download PPT
              </Button>
            ) : null}

          </div>

          {/* ✅ Output Display Area */}
          <div className="flex-1 bg-card/80 rounded-xl overflow-auto p-4 space-y-6">
            {isGenerating ? (
              <p className="text-sm text-muted-foreground italic">
                Generating... please wait.
              </p>
            ) : imageUrl ? (
              <div className="flex flex-col items-center space-y-4">
                <img
                  src={imageUrl}
                  alt="Generated result"
                  className="max-w-full rounded-lg shadow-md border border-border"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(imageUrl, '_blank')}
                  className="bg-gradient-to-r from-[#7B61FF] to-[#9F7AEA] text-white"
                >
                  View Full Image
                </Button>
              </div>
            ) : codeOutput ? (
              <pre className="bg-black text-white p-3 rounded-md text-sm overflow-x-auto">
                {codeOutput}
              </pre>
            ) : finalOutput ? (
              <div className="text-sm whitespace-pre-wrap">{finalOutput}</div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Output will appear here...
              </p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
