import Chatbot from './Chatbot'; // Kyunki Chatbot ab employee folder mein hai

export default function ChatbotPage() {
  const user = JSON.parse(localStorage.getItem('user'));
  return (
    <div className="h-full w-full p-6">
        <Chatbot userType="EMPLOYEE" empId={user?.id} isPage={true} />
    </div>
  );
}