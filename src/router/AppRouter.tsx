import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/contexts'
import { ProtectedRoute } from '@/components'
import { UserRole } from '@/types'

// Layouts
import { OperationsLayout } from '@/layouts/OperationsLayout'
import { SalesLayout } from '@/layouts/SalesLayout'
import { SalesCenterLayout } from '@/layouts/SalesCenterLayout'

// Pages
import { LoginPage } from '@/pages/Login'
import { NotFoundPage } from '@/pages/NotFound'

// Operations Pages
import {
  OperationsDashboard,
  OrganizationPage as OperationsOrganizationPage,
  AccountPage as OperationsAccountPage,
  RolePage as OperationsRolePage,
  AccountSettingsPage as OperationsAccountSettingsPage,
  PlatformPage,
  UsersPage,
  OrdersPage,
  SettingsPage,
} from '@/pages/Operations'

// Sales Pages
import {
  SalesDashboard,
  CustomersPage,
  TasksPage,
  PerformancePage,
  ProfilePage,
} from '@/pages/Sales'

// Sales Center Pages
import {
  SalesCenterDashboard,
  OrganizationPage as SalesCenterOrganizationPage,
  FoodPage,
  PriceAnalysisPage,
  SupplierPage,
  PurchasePage,
  AccountPage,
  RolePage,
  SettingsPage as SalesCenterSettingsPage,
} from '@/pages/SalesCenter'

export function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* 登录页面 */}
          <Route path="/login" element={<LoginPage />} />

          {/* 运营端路由 */}
          <Route
            path="/operations"
            element={
              <ProtectedRoute allowedRoles={[UserRole.OPERATIONS]}>
                <OperationsLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OperationsDashboard />} />
            <Route path="organization" element={<OperationsOrganizationPage />} />
            <Route path="account" element={<OperationsAccountPage />} />
            <Route path="role" element={<OperationsRolePage />} />
            <Route path="account-settings" element={<OperationsAccountSettingsPage />} />
            <Route path="platform" element={<PlatformPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* 机构端路由 */}
          <Route
            path="/sales"
            element={
              <ProtectedRoute allowedRoles={[UserRole.SALES]}>
                <SalesLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SalesDashboard />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="performance" element={<PerformancePage />} />
            <Route path="profile" element={<ProfilePage />} />
          </Route>

          {/* 机构中心端路由 */}
          <Route
            path="/sales-center"
            element={
              <ProtectedRoute allowedRoles={[UserRole.SALES_CENTER]}>
                <SalesCenterLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<SalesCenterDashboard />} />
            <Route path="organization" element={<SalesCenterOrganizationPage />} />
            <Route path="food" element={<FoodPage />} />
            <Route path="price-analysis" element={<PriceAnalysisPage />} />
            <Route path="supplier" element={<SupplierPage />} />
            <Route path="purchase" element={<PurchasePage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="role" element={<RolePage />} />
            <Route path="settings" element={<SalesCenterSettingsPage />} />
          </Route>

          {/* 根路径重定向到登录页 */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* 404 页面 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
