package com.ssotracker.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.ssotracker.dto.AdminUserRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

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
    void supportsAdminUserCrud() throws Exception {
        AdminUserRequest create = new AdminUserRequest(
                "Ana",
                "Reyes",
                "ana.reyes@cit.edu",
                "Registrar Admin",
                true
        );

        String body = mockMvc.perform(post("/api/admin-users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(create)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.adminId").exists())
                .andExpect(jsonPath("$.email").value("ana.reyes@cit.edu"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long id = objectMapper.readTree(body).get("adminId").asLong();

        mockMvc.perform(get("/api/admin-users/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana"));

        AdminUserRequest update = new AdminUserRequest(
                "Ana Marie",
                "Reyes",
                "ana.reyes@cit.edu",
                "Senior Registrar Admin",
                true
        );

        mockMvc.perform(put("/api/admin-users/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("Ana Marie"))
                .andExpect(jsonPath("$.position").value("Senior Registrar Admin"));

        mockMvc.perform(get("/api/admin-users"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));

        mockMvc.perform(delete("/api/admin-users/{id}", id))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/admin-users/{id}", id))
                .andExpect(status().isNotFound());
    }
}
