
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, Monitor, FolderOpen, Power, Wifi } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TcpClient = () => {
  const [ipAddress, setIpAddress] = useState('192.168.1.100');
  const [isConnected, setIsConnected] = useState(false);
  const [responses, setResponses] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Simulate TCP connection and command sending
  const sendCommand = async (command: string, description: string) => {
    if (!ipAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a valid IP address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    
    try {
      // In a real implementation, this would use a native TCP plugin
      // For now, we'll simulate the network request
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
      
      // Simulate different responses based on command
      let response = '';
      switch (command) {
        case 'open_notepad':
          response = 'Notepad.exe started successfully';
          break;
        case 'list_dir':
          response = `Directory listing:\nC:\\Users\\User\\Desktop\\\n  - document.txt\n  - project.pdf\n  - photos\\`;
          break;
        case 'shutdown':
          response = 'Shutdown command initiated. System will shutdown in 60 seconds.';
          break;
        default:
          response = 'Command executed';
      }
      
      const newResponse = `[${timestamp}] ${description}\nCommand: ${command}\nResponse: ${response}`;
      setResponses(prev => [newResponse, ...prev]);
      setIsConnected(true);
      
      toast({
        title: "Success",
        description: `${description} executed successfully`,
      });
    } catch (error) {
      const errorResponse = `[${timestamp}] ${description}\nCommand: ${command}\nError: Failed to connect to ${ipAddress}:12345`;
      setResponses(prev => [errorResponse, ...prev]);
      
      toast({
        title: "Connection Failed",
        description: `Could not connect to ${ipAddress}:12345`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearResponses = () => {
    setResponses([]);
    setIsConnected(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center py-6">
          <Monitor className="w-12 h-12 mx-auto mb-3 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Windows Remote Control</h1>
          <p className="text-gray-600">Send commands to your Windows PC</p>
        </div>

        {/* Connection Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Connection Settings
            </CardTitle>
            <CardDescription>
              Enter your Windows machine's IP address
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="192.168.1.100"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="flex-1"
              />
              <div className="px-3 py-2 bg-gray-100 rounded-md text-sm text-gray-600">
                :12345
              </div>
            </div>
            {isConnected && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Connected to {ipAddress}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Commands Card */}
        <Card>
          <CardHeader>
            <CardTitle>Remote Commands</CardTitle>
            <CardDescription>
              Click buttons to send commands to your Windows PC
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => sendCommand('open_notepad', 'Open Notepad')}
              disabled={isLoading}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <Monitor className="w-5 h-5" />
              Open Notepad
            </Button>
            
            <Button
              onClick={() => sendCommand('list_dir', 'List Directory')}
              disabled={isLoading}
              className="w-full justify-start gap-3 h-12"
              variant="outline"
            >
              <FolderOpen className="w-5 h-5" />
              List Directory
            </Button>
            
            <Button
              onClick={() => sendCommand('shutdown', 'Shutdown PC')}
              disabled={isLoading}
              className="w-full justify-start gap-3 h-12"
              variant="destructive"
            >
              <Power className="w-5 h-5" />
              Shutdown PC
            </Button>
          </CardContent>
        </Card>

        {/* Response Log Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Server Response Log</CardTitle>
              {responses.length > 0 && (
                <Button
                  onClick={clearResponses}
                  variant="ghost"
                  size="sm"
                >
                  Clear
                </Button>
              )}
            </div>
            <CardDescription>
              View responses and errors from your Windows machine
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-64 w-full">
              {responses.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <AlertCircle className="w-8 h-8 mb-2" />
                  <p className="text-sm">No responses yet</p>
                  <p className="text-xs">Send a command to see responses here</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <div key={index}>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <pre className="text-xs whitespace-pre-wrap font-mono text-gray-800">
                          {response}
                        </pre>
                      </div>
                      {index < responses.length - 1 && <Separator className="my-2" />}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Status Indicator */}
        {isLoading && (
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-blue-700 text-sm">Sending command...</span>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TcpClient;
