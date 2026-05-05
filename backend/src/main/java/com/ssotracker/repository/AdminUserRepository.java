package com.ssotracker.repository;

import com.ssotracker.model.AdminUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface AdminUserRepository extends JpaRepository<AdminUser, Long> {
    Optional<AdminUser> findByEmail(String email);
    boolean existsByEmail(String email);
    
    // View-only profile endpoint (read profile, not editable)
    @Query("SELECT a FROM AdminUser a WHERE a.adminId = :adminId")
    Optional<AdminUser> getAdminProfileById(@Param("adminId") Long adminId);
}
