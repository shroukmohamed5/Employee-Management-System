import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EmployeeService } from './employee.service';
import { AuthService } from '../auth.service';
import { AttendanceService } from './attendance.service';
import { Employee } from './employee';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  public employees: Employee[] = [];
  public isCollapsed = false;
  public activeMenu = 'employees';

  // Settings
  public isDark = false;
  public companyName = 'EmpManager';
  public selectedLanguage = 'en';
  public oldPassword = '';
  public newPassword = '';
  public confirmPassword = '';
  public newEmail = '';
  public passwordMsg = '';
  public passwordError = false;
  public companyMsg = '';
  public fingerprintMsg = '';
  public fingerprintDevice = '';
  public fingerprintPort = '';

  // Attendance
  public todayAttendance: any[] = [];
  public attendanceMsg = '';
  public attendanceError = false;
  public manualEmployeeId = '';

  // Employee forms
  public newEmployee: Employee = { id: 0, name: '', email: '', jobTitle: '', phone: '', imageUrl: '', employeeCode: '' };
  public editEmployee: Employee = { id: 0, name: '', email: '', jobTitle: '', phone: '', imageUrl: '', employeeCode: '' };
  public employeeToDelete: Employee | null = null;
  public showEditPopup = false;
  public showDeletePopup = false;
  public formErrors: any = {};
  public editErrors: any = {};

  public labels: any = {
    en: {
      employees: 'Employees', dashboard: 'Dashboard', addEmployee: 'Add Employee',
      reports: 'Reports', settings: 'Settings', attendance: 'Attendance',
      save: 'Save', cancel: 'Cancel', edit: '✏️ Edit', delete: '🗑️ Delete',
      totalEmployees: 'Total Employees', companyName: 'Company Name',
      changePassword: 'Change Email & Password', currentPassword: 'Current password',
      newPasswordLabel: 'New password', confirmPassword: 'Confirm new password',
      newEmail: 'New Email (optional)', updatePassword: 'Update',
      language: 'Language', theme: 'Theme', light: 'Light', dark: 'Dark',
      fingerprint: 'Fingerprint & Attendance', configureDevice: 'Configure Device',
      deviceName: 'Device Name / IP', port: 'Port', saveConfig: 'Save Config',
      fullName: 'Full Name', email: 'Email', jobTitle: 'Job Title', phone: 'Phone',
      imageUrl: 'Image URL', fingerprintId: 'Fingerprint ID', saveEmployee: 'Save Employee',
      deleteConfirm: 'Are you sure you want to permanently delete',
      deleteWarning: 'This action cannot be undone.',
      noCancel: 'No, Cancel', yesDelete: 'Yes, Delete', editEmployee: 'Edit Employee',
      addNewEmployee: 'Add New Employee', reportsComingSoon: '📈 Reports Coming Soon',
      savedSuccess: 'Saved successfully!', passwordSuccess: 'Updated successfully!',
      passwordMismatch: 'Passwords do not match!', passwordWrong: 'Current password is incorrect!',
      fingerprintSaved: 'Device configured!', checkIn: '✅ Check In',
      checkOut: '🚪 Check Out', markAbsent: '❌ Mark Absent',
      todayAttendance: "Today's Attendance", name: 'Name', status: 'Status',
      checkInTime: 'Check In', checkOutTime: 'Check Out', enterEmployeeId: 'Enter Employee ID',
      present: 'Present', absent: 'Absent', noRecord: 'No record'
    },
    ar: {
      employees: 'الموظفون', dashboard: 'لوحة التحكم', addEmployee: 'إضافة موظف',
      reports: 'التقارير', settings: 'الإعدادات', attendance: 'الحضور والغياب',
      save: 'حفظ', cancel: 'إلغاء', edit: '✏️ تعديل', delete: '🗑️ حذف',
      totalEmployees: 'إجمالي الموظفين', companyName: 'اسم الشركة',
      changePassword: 'تغيير الإيميل وكلمة المرور', currentPassword: 'كلمة المرور الحالية',
      newPasswordLabel: 'كلمة المرور الجديدة', confirmPassword: 'تأكيد كلمة المرور',
      newEmail: 'الإيميل الجديد (اختياري)', updatePassword: 'تحديث',
      language: 'اللغة', theme: 'المظهر', light: 'فاتح', dark: 'داكن',
      fingerprint: 'البصمة والحضور', configureDevice: 'إعداد الجهاز',
      deviceName: 'اسم الجهاز / IP', port: 'المنفذ', saveConfig: 'حفظ الإعدادات',
      fullName: 'الاسم الكامل', email: 'البريد الإلكتروني', jobTitle: 'المسمى الوظيفي',
      phone: 'الهاتف', imageUrl: 'رابط الصورة', fingerprintId: 'رقم البصمة',
      saveEmployee: 'حفظ الموظف', deleteConfirm: 'هل أنت متأكد من حذف',
      deleteWarning: 'لا يمكن التراجع عن هذا الإجراء.',
      noCancel: 'لا، إلغاء', yesDelete: 'نعم، احذف', editEmployee: 'تعديل موظف',
      addNewEmployee: 'إضافة موظف جديد', reportsComingSoon: '📈 التقارير قريباً',
      savedSuccess: 'تم الحفظ بنجاح!', passwordSuccess: 'تم التحديث بنجاح!',
      passwordMismatch: 'كلمتا المرور غير متطابقتين!', passwordWrong: 'كلمة المرور الحالية خاطئة!',
      fingerprintSaved: 'تم إعداد الجهاز!', checkIn: '✅ تسجيل حضور',
      checkOut: '🚪 تسجيل انصراف', markAbsent: '❌ تسجيل غياب',
      todayAttendance: 'حضور اليوم', name: 'الاسم', status: 'الحالة',
      checkInTime: 'وقت الحضور', checkOutTime: 'وقت الانصراف', enterEmployeeId: 'أدخل رقم الموظف',
      present: 'حاضر', absent: 'غائب', noRecord: 'لا يوجد'
    }
  };

  get t() { return this.labels[this.selectedLanguage]; }
  get isArabic() { return this.selectedLanguage === 'ar'; }

  constructor(
    private employeeService: EmployeeService,
    private authService: AuthService,
    private attendanceService: AttendanceService,
    private router: Router
  ) {}

  public ngOnInit(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }
    this.companyName = localStorage.getItem('companyName') || 'EmpManager';
    this.selectedLanguage = localStorage.getItem('language') || 'en';
    this.isDark = localStorage.getItem('isDark') === 'true';
    this.fingerprintDevice = localStorage.getItem('fingerprintDevice') || '';
    this.fingerprintPort = localStorage.getItem('fingerprintPort') || '';
    this.getEmployees();
  }

  public getEmployees(): void {
    this.employeeService.getEmployees().subscribe(r => this.employees = r);
  }

  public loadTodayAttendance(): void {
    this.attendanceService.getTodayAttendance().subscribe(r => this.todayAttendance = r);
  }

  public checkIn(): void {
    if (!this.manualEmployeeId) { this.showAttMsg('Please enter employee ID', true); return; }
    this.attendanceService.checkIn(Number(this.manualEmployeeId)).subscribe({
      next: () => { this.showAttMsg('Check-in recorded!', false); this.loadTodayAttendance(); this.manualEmployeeId = ''; },
      error: (e) => this.showAttMsg(e.error?.message || 'Error', true)
    });
  }

  public checkOut(): void {
    if (!this.manualEmployeeId) { this.showAttMsg('Please enter employee ID', true); return; }
    this.attendanceService.checkOut(Number(this.manualEmployeeId)).subscribe({
      next: () => { this.showAttMsg('Check-out recorded!', false); this.loadTodayAttendance(); this.manualEmployeeId = ''; },
      error: (e) => this.showAttMsg(e.error?.message || 'Error', true)
    });
  }

  public markAbsent(): void {
    if (!this.manualEmployeeId) { this.showAttMsg('Please enter employee ID', true); return; }
    this.attendanceService.markAbsent(Number(this.manualEmployeeId)).subscribe({
      next: () => { this.showAttMsg('Marked as absent!', false); this.loadTodayAttendance(); this.manualEmployeeId = ''; },
      error: (e) => this.showAttMsg(e.error?.message || 'Error', true)
    });
  }

  private showAttMsg(msg: string, isError: boolean): void {
    this.attendanceMsg = msg; this.attendanceError = isError;
    setTimeout(() => this.attendanceMsg = '', 3000);
  }

  public saveCompanyName(): void {
    localStorage.setItem('companyName', this.companyName);
    this.companyMsg = this.t.savedSuccess;
    setTimeout(() => this.companyMsg = '', 3000);
  }

  public saveLanguage(): void { localStorage.setItem('language', this.selectedLanguage); }
  public saveTheme(): void { localStorage.setItem('isDark', String(this.isDark)); }

  public saveFingerprintConfig(): void {
    localStorage.setItem('fingerprintDevice', this.fingerprintDevice);
    localStorage.setItem('fingerprintPort', this.fingerprintPort);
    this.fingerprintMsg = this.t.fingerprintSaved;
    setTimeout(() => this.fingerprintMsg = '', 3000);
  }

  public updatePassword(): void {
    this.passwordMsg = ''; this.passwordError = false;
    if (!this.oldPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordMsg = 'Please fill all fields'; this.passwordError = true; return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.passwordMsg = this.t.passwordMismatch; this.passwordError = true; return;
    }
    this.authService.changePassword(this.oldPassword, this.newPassword).subscribe({
      next: () => {
        this.passwordMsg = this.t.passwordSuccess; this.passwordError = false;
        this.oldPassword = ''; this.newPassword = ''; this.confirmPassword = '';
        setTimeout(() => this.passwordMsg = '', 3000);
      },
      error: () => { this.passwordMsg = this.t.passwordWrong; this.passwordError = true; }
    });
  }

  public addEmployee(): void {
    this.formErrors = {};
    if (!this.newEmployee.name?.trim()) this.formErrors.name = true;
    if (!this.newEmployee.email?.trim()) this.formErrors.email = true;
    if (!this.newEmployee.jobTitle?.trim()) this.formErrors.jobTitle = true;
    if (!this.newEmployee.phone?.trim()) this.formErrors.phone = true;
    if (Object.keys(this.formErrors).length > 0) return;
    const { id, employeeCode, ...employeeData } = this.newEmployee;
    this.employeeService.addEmployee(employeeData as Employee).subscribe(() => {
      this.getEmployees(); this.setActive('employees');
      this.newEmployee = { id: 0, name: '', email: '', jobTitle: '', phone: '', imageUrl: '', employeeCode: '' };
    });
  }

  public openEdit(employee: Employee): void { this.editEmployee = { ...employee }; this.editErrors = {}; this.showEditPopup = true; }
  public openDelete(employee: Employee): void { this.employeeToDelete = employee; this.showDeletePopup = true; }
  public closePopup(): void { this.showEditPopup = false; this.showDeletePopup = false; }

  public updateEmployee(): void {
    this.editErrors = {};
    if (!this.editEmployee.name?.trim()) this.editErrors.name = true;
    if (!this.editEmployee.email?.trim()) this.editErrors.email = true;
    if (!this.editEmployee.jobTitle?.trim()) this.editErrors.jobTitle = true;
    if (!this.editEmployee.phone?.trim()) this.editErrors.phone = true;
    if (Object.keys(this.editErrors).length > 0) return;
    this.employeeService.updateEmployee(this.editEmployee).subscribe(() => { this.getEmployees(); this.closePopup(); });
  }

  public confirmDelete(): void {
    if (this.employeeToDelete) {
      this.employeeService.deleteEmployee(this.employeeToDelete.id).subscribe(() => { this.getEmployees(); this.closePopup(); });
    }
  }

  public logout(): void { this.authService.logout(); this.router.navigate(['/login']); }
  public toggleSidebar(): void { this.isCollapsed = !this.isCollapsed; }
  public setActive(menu: string): void {
    this.activeMenu = menu;
    if (menu === 'attendance') this.loadTodayAttendance();
  }
}