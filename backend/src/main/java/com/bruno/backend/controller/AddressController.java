package com.bruno.backend.controller;

import com.bruno.backend.dto.AddressDTO;
import com.bruno.backend.entity.Address;
import com.bruno.backend.entity.AddressType;
import com.bruno.backend.entity.User;
import com.bruno.backend.service.AddressService;
import com.bruno.backend.service.AuthorizationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class AddressController {

    private final AddressService addressService;
    private final AuthorizationService authorizationService;

    @GetMapping
    public ResponseEntity<List<AddressDTO>> getUserAddresses() {
        User currentUser = authorizationService.getCurrentUser();
        List<Address> addresses = addressService.getUserAddresses(currentUser.getId());
        List<AddressDTO> addressDTOs = addressService.toDTOList(addresses);
        return ResponseEntity.ok(addressDTOs);
    }

    @PostMapping
    public ResponseEntity<AddressDTO> createAddress(@Valid @RequestBody AddressDTO addressDTO) {
        User currentUser = authorizationService.getCurrentUser();
        Address address = addressService.createAddress(currentUser, addressDTO);
        AddressDTO responseDTO = addressService.toDTO(address);
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AddressDTO> updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressDTO addressDTO) {
        User currentUser = authorizationService.getCurrentUser();
        Address address = addressService.updateAddress(id, addressDTO, currentUser);
        AddressDTO responseDTO = addressService.toDTO(address);
        return ResponseEntity.ok(responseDTO);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAddress(@PathVariable Long id) {
        User currentUser = authorizationService.getCurrentUser();
        addressService.deleteAddress(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/default/{type}")
    public ResponseEntity<AddressDTO> getDefaultAddress(@PathVariable String type) {
        User currentUser = authorizationService.getCurrentUser();
        try {
            AddressType addressType = AddressType.valueOf(type.toUpperCase());
            Address address = addressService.getDefaultAddress(currentUser.getId(), addressType);
            if (address != null) {
                return ResponseEntity.ok(addressService.toDTO(address));
            }
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<List<AddressDTO>> getAddressesByType(@PathVariable String type) {
        User currentUser = authorizationService.getCurrentUser();
        try {
            AddressType addressType = AddressType.valueOf(type.toUpperCase());
            List<Address> addresses = addressService.getAddressesByType(currentUser.getId(), addressType);
            List<AddressDTO> addressDTOs = addressService.toDTOList(addresses);
            return ResponseEntity.ok(addressDTOs);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}