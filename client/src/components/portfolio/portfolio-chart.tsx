import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PortfolioChartProps {
  data: Array<{ label: string; value: number }>;
}

export default function PortfolioChart({ data }: PortfolioChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth * devicePixelRatio;
    canvas.height = canvas.offsetHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.offsetHeight);
    gradient.addColorStop(0, 'rgba(0, 102, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 102, 255, 0.05)');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    // Draw line chart
    const padding = 40;
    const chartWidth = canvas.offsetWidth - padding * 2;
    const chartHeight = canvas.offsetHeight - padding * 2;

    if (data.length > 1) {
      const maxValue = Math.max(...data.map(d => d.value));
      const minValue = Math.min(...data.map(d => d.value));
      const valueRange = maxValue - minValue;

      // Draw gradient area
      ctx.beginPath();
      ctx.moveTo(padding, padding + chartHeight);
      
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.lineTo(padding + chartWidth, padding + chartHeight);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      // Draw line
      ctx.beginPath();
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        if (index === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      
      ctx.strokeStyle = '#0066FF';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Draw points
      data.forEach((point, index) => {
        const x = padding + (index / (data.length - 1)) * chartWidth;
        const y = padding + chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
        
        ctx.beginPath();
        ctx.arc(x, y, 6, 0, 2 * Math.PI);
        ctx.fillStyle = '#0066FF';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    }
  }, [data]);

  const mockData = [
    { label: 'Jan', value: 85000 },
    { label: 'Feb', value: 92000 },
    { label: 'Mar', value: 88000 },
    { label: 'Apr', value: 103000 },
    { label: 'May', value: 118000 },
    { label: 'Jun', value: 125000 },
    { label: 'Jul', value: 127845 },
  ];

  return (
    <Card className="bg-dark-surface border-dark-border">
      <CardHeader className="p-3 lg:p-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-lg lg:text-xl font-semibold">Portfolio Performance</CardTitle>
          <div className="flex space-x-1 lg:space-x-2">
            <Button variant="secondary" size="sm" className="bg-crypto-blue text-white text-xs lg:text-sm px-2 lg:px-3">
              7D
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs lg:text-sm px-2 lg:px-3">
              1M
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs lg:text-sm px-2 lg:px-3">
              3M
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white text-xs lg:text-sm px-2 lg:px-3">
              1Y
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 lg:p-6 pt-0">
        <div className="h-48 lg:h-64">
          <canvas
            ref={canvasRef}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
