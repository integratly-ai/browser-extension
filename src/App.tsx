import { ChatHistory } from 'src/components/ChatHistory.tsx';
import { Footer } from 'src/components/Footer.tsx';
import { Header } from 'src/components/Header.tsx';

function App() {
  return (
    <div className="h-[600px] w-[30rem] bg-gray-800 text-white flex flex-col">
      <Header />
      <ChatHistory />
      <Footer />
    </div>
  );
}

export default App;
