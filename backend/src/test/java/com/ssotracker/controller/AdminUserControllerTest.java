package com.ssotracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssotracker.dto.AdminUserRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AdminUserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void keepsSingleFixedAdminAccount() throws Exception {
        String body = mockMvc.perform(get("/api/admin-users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].email").value("Admin@cit.edu"))
                .andExpect(jsonPath("$[0].mustChangePassword").value(false))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long id = objectMapper.readTree(body).get(0).get("adminId").asLong();

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "admin@cit.edu",
                                "password", "Admin123!",
                                "role", "admin"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.userId").value(id))
                .andExpect(jsonPath("$.email").value("Admin@cit.edu"))
                .andExpect(jsonPath("$.mustChangePassword").value(false));

        AdminUserRequest create = new AdminUserRequest(
                "Ana",
                "Reyes",
                "ana.reyes@cit.edu",
                "Registrar Admin",
                true,
                "Admin123!"
        );

        mockMvc.perform(post("/api/admin-users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(create)))
                .andExpect(status().isConflict());

        mockMvc.perform(get("/api/admin-users/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("Admin@cit.edu"));

        AdminUserRequest update = new AdminUserRequest(
                "Ana Marie",
                "Reyes",
                "ana.reyes@cit.edu",
                "Senior Registrar Admin",
                true,
                "Admin123!"
        );

        mockMvc.perform(put("/api/admin-users/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana Marie"))
                .andExpect(jsonPath("$.email").value("Admin@cit.edu"))
                .andExpect(jsonPath("$.position").value("Senior Registrar Admin"));

        mockMvc.perform(get("/api/admin-users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)));

        mockMvc.perform(delete("/api/admin-users/{id}", id))
                .andExpect(status().isConflict());
    }
}
