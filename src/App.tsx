import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './lib/auth-context';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AppLayout } from './components/AppLayout';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import CreateEventPage from './pages/CreateEventPage';
import EventDetailsPage from './pages/EventDetailsPage';
import AddExpensePage from './pages/AddExpensePage';
import InviteParticipantsPage from './pages/InviteParticipantsPage';
import SettlementPage from './pages/SettlementPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import ChangePasswordPage from './pages/ChangePasswordPage';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/entrar" element={<LoginPage />} />
        <Route path="/cadastro" element={<SignUpPage />} />
        <Route path="/recuperar-senha" element={<ForgotPasswordPage />} />

        {/* Privadas (com layout) */}
        <Route
          path="/app/*"
          element={
            <ProtectedRoute>
              <AppLayout>
                <Routes>
                  <Route index element={<HomePage />} />
                  <Route path="historico" element={<HistoryPage />} />
                  <Route path="notificacoes" element={<NotificationsPage />} />
                  <Route path="eventos/novo" element={<CreateEventPage />} />
                  <Route path="eventos/:eventId" element={<EventDetailsPage />} />
                  <Route path="eventos/:eventId/despesa" element={<AddExpensePage />} />
                  <Route path="eventos/:eventId/despesa/:expenseId" element={<AddExpensePage />} />
                  <Route path="eventos/:eventId/convidar" element={<InviteParticipantsPage />} />
                  <Route path="eventos/:eventId/acerto" element={<SettlementPage />} />
                  <Route path="perfil" element={<ProfilePage />} />
                  <Route path="perfil/editar" element={<EditProfilePage />} />
                  <Route path="perfil/senha" element={<ChangePasswordPage />} />
                  <Route path="*" element={<Navigate to="/app" replace />} />
                </Routes>
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
