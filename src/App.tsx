import { useParticipants } from "./contexts/ParticipantContext";
import { useSettings } from "./contexts/SettingsContext";

function App() {
  const { participants } = useParticipants();
  const { settings, toggleDarkMode } = useSettings();

  return (
    <div className="bg-background text-foreground min-h-screen">
      <header className="border-border border-b">
        <div className="container mx-auto flex items-center justify-between p-4">
          <h1 className="text-2xl font-bold">Random Selector Wheel</h1>
          <button
            onClick={toggleDarkMode}
            className="hover:bg-accent rounded-md p-2"
            aria-label={
              settings.isDarkMode
                ? "Switch to light mode"
                : "Switch to dark mode"
            }
          >
            {settings.isDarkMode ? "🌞" : "🌙"}
          </button>
        </div>
      </header>

      <main className="container mx-auto flex-grow p-4">
        <div className="mx-auto max-w-3xl">
          {/* 여기에 실제 컴포넌트들이 추가될 예정입니다 */}
          <p>현재 참가자 수: {participants.length}</p>
        </div>
      </main>

      <footer className="text-muted-foreground border-border container mx-auto border-t p-4 text-center text-sm">
        <p>
          © {new Date().getFullYear()} Random Selector Wheel. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default App;
