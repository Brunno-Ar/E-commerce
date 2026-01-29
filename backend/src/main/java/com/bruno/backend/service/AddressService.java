package com.bruno.backend.service;

import com.bruno.backend.dto.AddressDTO;
import com.bruno.backend.entity.Address;
import com.bruno.backend.entity.AddressType;
import com.bruno.backend.entity.User;
import com.bruno.backend.repository.AddressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AddressService {

    private final AddressRepository addressRepository;

    public List<Address> getUserAddresses(String userId) {
        return addressRepository.findByUserId(Long.parseLong(userId));
    }

    public Address createAddress(User user, AddressDTO addressDTO) {
        Address address = new Address();
        address.setUser(user);
        address.setType(addressDTO.getType());
        address.setRecipient(addressDTO.getRecipient());
        address.setStreet(addressDTO.getStreet());
        address.setNumber(addressDTO.getNumber());
        address.setComplement(addressDTO.getComplement());
        address.setNeighborhood(addressDTO.getNeighborhood());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setZipCode(addressDTO.getZipCode());
        address.setCountry(addressDTO.getCountry());
        address.setReferencePoint(addressDTO.getReferencePoint());

        if (addressDTO.isDefault()) {
            setDefaultAddress(user, addressDTO.getType());
        }
        address.setDefault(addressDTO.isDefault());

        return addressRepository.save(address);
    }

    public Address updateAddress(Long addressId, AddressDTO addressDTO, User user) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        address.setType(addressDTO.getType());
        address.setRecipient(addressDTO.getRecipient());
        address.setStreet(addressDTO.getStreet());
        address.setNumber(addressDTO.getNumber());
        address.setComplement(addressDTO.getComplement());
        address.setNeighborhood(addressDTO.getNeighborhood());
        address.setCity(addressDTO.getCity());
        address.setState(addressDTO.getState());
        address.setZipCode(addressDTO.getZipCode());
        address.setCountry(addressDTO.getCountry());
        address.setReferencePoint(addressDTO.getReferencePoint());

        if (addressDTO.isDefault() && !address.isDefault()) {
            setDefaultAddress(user, addressDTO.getType());
        }
        address.setDefault(addressDTO.isDefault());

        return addressRepository.save(address);
    }

    public void deleteAddress(Long addressId, User user) {
        Address address = addressRepository.findById(addressId)
                .orElseThrow(() -> new RuntimeException("Endereço não encontrado"));

        if (!address.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Acesso negado");
        }

        addressRepository.delete(address);
    }

    private void setDefaultAddress(User user, AddressType type) {
        List<Address> existingAddresses = addressRepository.findByUserAndType(user, type);
        existingAddresses.forEach(addr -> addr.setDefault(false));
        addressRepository.saveAll(existingAddresses);
    }

    public Address getDefaultAddress(String userId, AddressType type) {
        return addressRepository.findByUserIdAndType(Long.parseLong(userId), type)
                .stream()
                .filter(Address::isDefault)
                .findFirst()
                .orElse(null);
    }

    public List<Address> getAddressesByType(String userId, AddressType type) {
        return addressRepository.findByUserIdAndType(Long.parseLong(userId), type);
    }

    public AddressDTO toDTO(Address address) {
        AddressDTO dto = new AddressDTO();
        dto.setId(address.getId());
        dto.setType(address.getType());
        dto.setRecipient(address.getRecipient());
        dto.setStreet(address.getStreet());
        dto.setNumber(address.getNumber());
        dto.setComplement(address.getComplement());
        dto.setNeighborhood(address.getNeighborhood());
        dto.setCity(address.getCity());
        dto.setState(address.getState());
        dto.setZipCode(address.getZipCode());
        dto.setCountry(address.getCountry());
        dto.setReferencePoint(address.getReferencePoint());
        dto.setDefault(address.isDefault());
        return dto;
    }

    public List<AddressDTO> toDTOList(List<Address> addresses) {
        return addresses.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
}