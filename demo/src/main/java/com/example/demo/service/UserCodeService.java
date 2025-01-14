package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserCodeService {

    @Autowired
    private DynamoDbClient dynamoDbClient;

    private final String tableName = "user-identification-codes";

    public String addUserCode(String userCode) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("code", AttributeValue.builder().s(userCode).build());

        PutItemRequest request = PutItemRequest.builder()
                .tableName(tableName)
                .item(item)
                .build();

        dynamoDbClient.putItem(request);
        return "User code added successfully";
    }

    public boolean validateUserCode(String userCode) {
        Map<String, AttributeValue> key = new HashMap<>();
        key.put("code", AttributeValue.builder().s(userCode).build());

        GetItemRequest request = GetItemRequest.builder()
                .tableName(tableName)
                .key(key)
                .build();

        GetItemResponse response = dynamoDbClient.getItem(request);
        return response.hasItem();
    }
}
