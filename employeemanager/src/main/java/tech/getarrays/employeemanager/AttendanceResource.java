package tech.getarrays.employeemanager;

import tech.getarrays.employeemanager.model.Attendance;
import tech.getarrays.employeemanager.model.Employee;
import tech.getarrays.employeemanager.repo.AttendanceRepo;
import tech.getarrays.employeemanager.repo.EmployeeRepo;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/attendance")
@CrossOrigin(origins = "http://localhost:4200")
public class AttendanceResource {

    private final AttendanceRepo attendanceRepo;
    private final EmployeeRepo employeeRepo;

    public AttendanceResource(AttendanceRepo attendanceRepo, EmployeeRepo employeeRepo) {
        this.attendanceRepo = attendanceRepo;
        this.employeeRepo = employeeRepo;
    }

    @GetMapping("/today")
    public List<Attendance> getToday() {
        return attendanceRepo.findByDate(LocalDate.now());
    }

    @GetMapping("/employee/{id}")
    public List<Attendance> getByEmployee(@PathVariable Long id) {
        return attendanceRepo.findByEmployeeId(id);
    }

    @PostMapping("/checkin")
    public ResponseEntity<?> checkIn(@RequestBody Map<String, String> body) {
        Long employeeId = Long.parseLong(body.get("employeeId"));
        Optional<Employee> empOpt = employeeRepo.findById(employeeId);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Employee not found"));
        }
        Optional<Attendance> existing = attendanceRepo.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (existing.isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Already checked in today"));
        }
        Attendance att = new Attendance();
        att.setEmployeeId(employeeId);
        att.setEmployeeName(empOpt.get().getName());
        att.setDate(LocalDate.now());
        att.setCheckIn(LocalTime.now());
        att.setStatus("PRESENT");
        return ResponseEntity.ok(attendanceRepo.save(att));
    }

    @PutMapping("/checkout/{employeeId}")
    public ResponseEntity<?> checkOut(@PathVariable Long employeeId) {
        Optional<Attendance> att = attendanceRepo.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (att.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "No check-in found today"));
        }
        Attendance a = att.get();
        a.setCheckOut(LocalTime.now());
        return ResponseEntity.ok(attendanceRepo.save(a));
    }

    @PostMapping("/absent")
    public ResponseEntity<?> markAbsent(@RequestBody Map<String, String> body) {
        Long employeeId = Long.parseLong(body.get("employeeId"));
        Optional<Employee> empOpt = employeeRepo.findById(employeeId);
        if (empOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of("message", "Employee not found"));
        }
        Optional<Attendance> existing = attendanceRepo.findByEmployeeIdAndDate(employeeId, LocalDate.now());
        if (existing.isPresent()) {
            return ResponseEntity.status(400).body(Map.of("message", "Attendance already recorded"));
        }
        Attendance att = new Attendance();
        att.setEmployeeId(employeeId);
        att.setEmployeeName(empOpt.get().getName());
        att.setDate(LocalDate.now());
        att.setStatus("ABSENT");
        return ResponseEntity.ok(attendanceRepo.save(att));
    }
}