import { Challenge } from '@/types/ide';

export const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: 'jwt-auth-challenge',
    title: 'Fix the Login API Bug',
    mode: 'debugging',
    language: 'javascript',
    difficulty: 'Medium',
    estimatedTime: '30m',
    description: 'The login API returns a 500 error when valid credentials are provided. Find and fix the root cause.',
    instructions: [
      'API should return 200 for valid user',
      'Handle edge cases properly',
      'Keep existing functionality'
    ],
    initialFiles: [
      {
        id: 'file-1',
        name: 'app.js',
        path: 'src/app.js',
        language: 'javascript',
        content: `// Login API - Fix the bug
const express = require('express');
const app = express();
const { validateUser } = require('./utils');

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required'
    });
  }

  const user = validateUser(email, password);
  // TODO: Fix the bug here
});
`
      },
      {
        id: 'file-2',
        name: 'utils.js',
        path: 'src/utils.js',
        language: 'javascript',
        content: `// User validation helper
const MOCK_USERS = [
  { id: 1, email: 'alex@devpractice.io', password: 'password123', name: 'Alex Developer' }
];

function validateUser(email, password) {
  const user = MOCK_USERS.find(u => u.email === email && u.password === password);
  return user || null;
}

module.exports = { validateUser, MOCK_USERS };
`
      },
      {
        id: 'file-3',
        name: 'test.js',
        path: 'tests/test.js',
        language: 'javascript',
        content: `// Login API Test Runner
const { validateUser } = require('../src/utils');

function runSuite() {
  const results = [];
  const u1 = validateUser('alex@devpractice.io', 'password123');
  results.push({ test: 'API should return 200 for valid user', status: u1 ? 'PASSED' : 'FAILED' });

  const u2 = validateUser('alex@devpractice.io', 'wrongpass');
  results.push({ test: 'Handle edge cases properly (401 on invalid)', status: !u2 ? 'PASSED' : 'FAILED' });

  results.push({ test: 'Keep existing functionality (400 on missing fields)', status: 'PASSED' });
  console.log(JSON.stringify(results, null, 2));
}

runSuite();
`
      },
      {
        id: 'file-4',
        name: 'package.json',
        path: 'package.json',
        language: 'json',
        content: `{
  "name": "challenge-project",
  "version": "0.1.0",
  "main": "src/app.js",
  "scripts": {
    "dev": "next dev",
    "test": "node tests/test.js"
  }
}`
      },
      {
        id: 'file-5',
        name: 'README.md',
        path: 'README.md',
        language: 'markdown',
        content: `# Fix the Login API Bug

### Problem Statement
The login API returns a 500 error when valid credentials are provided. Find and fix the root cause.

### Requirements
- API should return 200 for valid user
- Handle edge cases properly
- Keep existing functionality
`
      }
    ],
    testCases: [
      {
        id: 'tc-1',
        name: 'API should return 200 for valid user',
        input: '{"email":"alex@devpractice.io","password":"password123"}',
        expectedOutput: '200',
        isHidden: false,
        description: 'Valid credentials return HTTP 200 and user payload.'
      },
      {
        id: 'tc-2',
        name: 'Handle edge cases properly',
        input: '{"email":"alex@devpractice.io","password":"invalid"}',
        expectedOutput: '401',
        isHidden: false,
        description: 'Invalid credentials return HTTP 401 Invalid credentials.'
      },
      {
        id: 'tc-3',
        name: 'Keep existing functionality',
        input: '{}',
        expectedOutput: '400',
        isHidden: false,
        description: 'Missing email or password returns HTTP 400.'
      }
    ],
    solutionHints: [
      'Check if validateUser(email, password) returns null for invalid credentials.',
      'Return res.status(401).json({ error: "Invalid credentials" }) when !user, and res.status(200).json({ user }) when valid.'
    ]
  },
  {
    id: 'python-race-condition',
    title: 'Async Race Condition in Cart Checkout',
    mode: 'debugging',
    language: 'python',
    difficulty: 'Hard',
    estimatedTime: '40m',
    description: 'Concurrent inventory decrements lead to negative stock levels during flash sales. Implement thread-safe synchronization or stock checks.',
    instructions: [
      'Inspect cart_service.py.',
      'Identify where the stock check and stock decrement occur without locking.',
      'Implement atomic or mutex-protected inventory deduction.',
      'Ensure stock never drops below 0 when 10 concurrent requests arrive.'
    ],
    initialFiles: [
      {
        id: 'py-1',
        name: 'cart_service.py',
        path: 'cart_service.py',
        language: 'python',
        content: `import threading
import time

class InventoryService:
    def __init__(self, initial_stock: int = 5):
        self.stock = initial_stock
        self.lock = threading.Lock()

    def purchase(self, quantity: int) -> bool:
        # BUG: Race condition! Stock check happens before decrement without acquiring the lock.
        # FIX: Wrap check and decrement inside 'with self.lock:'
        with self.lock:
            if self.stock >= quantity:
                # Simulate small I/O delay
                time.sleep(0.01)
                self.stock -= quantity
                return True
            return False

def simulate_flash_sale():
    service = InventoryService(initial_stock=5)
    threads = []
    success_count = [0]
    
    def buyer():
        if service.purchase(1):
            success_count[0] += 1

    for _ in range(10):
        t = threading.Thread(target=buyer)
        threads.append(t)
        t.start()

    for t in threads:
        t.join()

    print(f"Final stock: {service.stock}")
    print(f"Successful orders: {success_count[0]}")
    return service.stock >= 0 and success_count[0] <= 5

if __name__ == "__main__":
    simulate_flash_sale()
`
      },
      {
        id: 'py-2',
        name: 'test_cart.py',
        path: 'test_cart.py',
        language: 'python',
        content: `from cart_service import InventoryService
import threading

def test_no_overselling():
    inv = InventoryService(initial_stock=3)
    results = []

    def try_buy():
        res = inv.purchase(1)
        results.append(res)

    threads = [threading.Thread(target=try_buy) for _ in range(10)]
    for t in threads:
        t.start()
    for t in threads:
        t.join()

    successful = [r for r in results if r]
    assert inv.stock >= 0, f"Stock went negative: {inv.stock}"
    assert len(successful) == 3, f"Expected 3 purchases, got {len(successful)}"
    print("ALL TESTS PASSED: Inventory integrity maintained.")

if __name__ == "__main__":
    test_no_overselling()
`
      }
    ],
    testCases: [
      {
        id: 'py-tc-1',
        name: 'Stock never drops below zero',
        input: 'STOCK_NON_NEGATIVE',
        expectedOutput: 'STOCK_INTEGRITY_OK',
        isHidden: false,
        description: 'Verify race conditions do not cause negative stock numbers.'
      },
      {
        id: 'py-tc-2',
        name: 'Concurrent purchases match exact stock count',
        input: 'CONCURRENT_LIMIT_CHECK',
        expectedOutput: 'PURCHASE_COUNT_EXACT',
        isHidden: false,
        description: 'Exactly initial_stock number of purchases should succeed.'
      }
    ],
    solutionHints: [
      'Use self.lock to protect the critical section in purchase().',
      'Ensure both checking self.stock and modifying self.stock are inside the synchronized block.'
    ]
  },
  {
    id: 'java-pagination-api',
    title: 'Spring Boot REST API Pagination & Sort',
    mode: 'feature',
    language: 'java',
    difficulty: 'Medium',
    estimatedTime: '35m',
    description: 'Implement zero-indexed Pageable metadata, sorting by field and direction, and slice calculations for high-traffic catalog APIs.',
    instructions: [
      'Inspect CatalogPagination.java.',
      'Implement paginateAndSort method taking (List<Product> items, int page, int size, String sortBy, String direction).',
      'Handle out-of-bounds page gracefully by returning an empty page list.',
      'Calculate totalPages and totalElements.'
    ],
    initialFiles: [
      {
        id: 'java-1',
        name: 'CatalogPagination.java',
        path: 'src/main/java/CatalogPagination.java',
        language: 'java',
        content: `import java.util.*;

public class CatalogPagination {

    public static class Product {
        public int id;
        public String name;
        public double price;

        public Product(int id, String name, double price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }

        @Override
        public String toString() {
            return name + " ($" + price + ")";
        }
    }

    public static class PageResult {
        public List<Product> content;
        public int page;
        public int size;
        public int totalPages;
        public int totalElements;

        public PageResult(List<Product> content, int page, int size, int totalElements) {
            this.content = content;
            this.page = page;
            this.size = size;
            this.totalElements = totalElements;
            this.totalPages = (int) Math.ceil((double) totalElements / size);
        }
    }

    public static PageResult paginate(List<Product> items, int page, int size) {
        if (items == null || items.isEmpty() || size <= 0) {
            return new PageResult(Collections.emptyList(), page, size, 0);
        }

        int total = items.size();
        int fromIndex = page * size;
        if (fromIndex >= total) {
            return new PageResult(Collections.emptyList(), page, size, total);
        }

        int toIndex = Math.min(fromIndex + size, total);
        List<Product> slice = items.subList(fromIndex, toIndex);
        return new PageResult(new ArrayList<>(slice), page, size, total);
    }

    public static void main(String[] args) {
        List<Product> catalog = Arrays.asList(
            new Product(1, "Mechanical Keyboard", 120.0),
            new Product(2, "Gaming Mouse", 60.0),
            new Product(3, "4K Monitor", 400.0),
            new Product(4, "USB-C Hub", 35.0),
            new Product(5, "Desk Mat", 25.0)
        );

        PageResult page0 = paginate(catalog, 0, 2);
        System.out.println("Page 0 count: " + page0.content.size() + ", Total Pages: " + page0.totalPages);
        PageResult page1 = paginate(catalog, 1, 2);
        System.out.println("Page 1 count: " + page1.content.size());
    }
}
`
      }
    ],
    testCases: [
      {
        id: 'java-tc-1',
        name: 'Page 0 returns first N elements',
        input: 'PAGE_0_SIZE_2',
        expectedOutput: '2 items, total pages 3',
        isHidden: false,
        description: 'Verify first slice from index 0 to 2.'
      },
      {
        id: 'java-tc-2',
        name: 'Out of bounds page returns empty content',
        input: 'PAGE_10_SIZE_2',
        expectedOutput: '0 items',
        isHidden: true,
        description: 'Requesting page beyond totalElements should return empty list.'
      }
    ],
    solutionHints: [
      'Use Math.min(fromIndex + size, total) to prevent IndexOutOfBoundsException.',
      'Check fromIndex >= totalElements to return empty list early.'
    ]
  },
  {
    id: 'cpp-lru-cache',
    title: 'Memory Leak & Eviction in LRU Cache',
    mode: 'debugging',
    language: 'cpp',
    difficulty: 'Hard',
    estimatedTime: '45m',
    description: 'Diagnose memory leaks and incorrect iterator invalidation in a doubly-linked list hashmap LRU cache implementation.',
    instructions: [
      'Inspect lru_cache.cpp.',
      'Ensure least recently used items are properly deleted from memory when capacity is exceeded.',
      'Verify O(1) get and put performance.'
    ],
    initialFiles: [
      {
        id: 'cpp-1',
        name: 'lru_cache.cpp',
        path: 'lru_cache.cpp',
        language: 'cpp',
        content: `#include <iostream>
#include <unordered_map>
#include <list>

class LRUCache {
private:
    int capacity;
    std::list<std::pair<int, int>> dll; // key, value
    std::unordered_map<int, std::list<std::pair<int, int>>::iterator> cache;

public:
    LRUCache(int cap) : capacity(cap) {}

    int get(int key) {
        auto it = cache.find(key);
        if (it == cache.end()) return -1;
        // Move to front
        dll.splice(dll.begin(), dll, it->second);
        return it->second->second;
    }

    void put(int key, int value) {
        auto it = cache.find(key);
        if (it != cache.end()) {
            dll.splice(dll.begin(), dll, it->second);
            it->second->second = value;
            return;
        }

        if (cache.size() >= capacity) {
            int lru_key = dll.back().first;
            dll.pop_back();
            cache.erase(lru_key);
        }

        dll.push_front({key, value});
        cache[key] = dll.begin();
    }
};

int main() {
    LRUCache lru(2);
    lru.put(1, 10);
    lru.put(2, 20);
    std::cout << "get(1): " << lru.get(1) << std::endl; // returns 10
    lru.put(3, 30); // evicts key 2
    std::cout << "get(2): " << lru.get(2) << std::endl; // returns -1 (evicted)
    lru.put(4, 40); // evicts key 1
    std::cout << "get(1): " << lru.get(1) << std::endl; // returns -1
    std::cout << "get(3): " << lru.get(3) << std::endl; // returns 30
    std::cout << "get(4): " << lru.get(4) << std::endl; // returns 40
    return 0;
}
`
      }
    ],
    testCases: [
      {
        id: 'cpp-tc-1',
        name: 'LRU Eviction Order',
        input: 'PUT_1_2_GET_1_PUT_3',
        expectedOutput: 'KEY_2_EVICTED',
        isHidden: false,
        description: 'Key 2 should be evicted because Key 1 was accessed via get.'
      }
    ],
    solutionHints: [
      'Remember to update the node position when get(key) is invoked.',
      'Check that erase() properly cleans the map reference.'
    ]
  },
  {
    id: 'c-packet-parser',
    title: 'Buffer Overflow in Network Packet Parser',
    mode: 'debugging',
    language: 'c',
    difficulty: 'Medium',
    estimatedTime: '30m',
    description: 'Diagnose and fix unbounded strcpy / memory copy vulnerability in a network header parsing function.',
    instructions: [
      'Inspect packet_parser.c.',
      'Replace unsafe memory copy functions with bounds-checked alternatives.',
      'Verify payload size headers match allocated buffer size.'
    ],
    initialFiles: [
      {
        id: 'c-1',
        name: 'packet_parser.c',
        path: 'packet_parser.c',
        language: 'c',
        content: `#include <stdio.h>
#include <string.h>
#include <stdlib.h>

#define MAX_PAYLOAD_SIZE 64

typedef struct {
    unsigned short packet_id;
    unsigned short length;
    char payload[MAX_PAYLOAD_SIZE];
} Packet;

int parse_packet(const char* raw_data, unsigned short raw_len, Packet* out_packet) {
    if (raw_len < 4) return -1; // Header too short

    out_packet->packet_id = (unsigned char)raw_data[0] | ((unsigned char)raw_data[1] << 8);
    out_packet->length = (unsigned char)raw_data[2] | ((unsigned char)raw_data[3] << 8);

    // SECURITY FIX: Enforce bounds checking to prevent buffer overflow
    if (out_packet->length >= MAX_PAYLOAD_SIZE) {
        return -2; // Payload exceeds buffer
    }

    if (raw_len < 4 + out_packet->length) {
        return -3; // Incomplete packet
    }

    memcpy(out_packet->payload, raw_data + 4, out_packet->length);
    out_packet->payload[out_packet->length] = '\\0';
    return 0;
}

int main() {
    Packet p;
    char mock_raw[] = { 0x01, 0x00, 0x05, 0x00, 'H', 'E', 'L', 'L', 'O' };
    int res = parse_packet(mock_raw, sizeof(mock_raw), &p);

    if (res == 0) {
        printf("Parsed Packet ID: %d, Length: %d, Payload: %s\\n", p.packet_id, p.length, p.payload);
    } else {
        printf("Packet parse error: %d\\n", res);
    }
    return 0;
}
`
      }
    ],
    testCases: [
      {
        id: 'c-tc-1',
        name: 'Safe payload parse',
        input: 'NORMAL_PACKET',
        expectedOutput: 'SUCCESS',
        isHidden: false,
        description: 'Packets below 64 bytes parse successfully.'
      },
      {
        id: 'c-tc-2',
        name: 'Oversized payload rejected',
        input: 'OVERFLOW_PACKET',
        expectedOutput: 'OVERFLOW_PREVENTED',
        isHidden: true,
        description: 'Packets with payload length >= 64 return error code -2.'
      }
    ],
    solutionHints: [
      'Check if out_packet->length is strictly less than MAX_PAYLOAD_SIZE.',
      'Ensure null termination does not write out of bounds.'
    ]
  },
  {
    id: 'ts-state-machine',
    title: 'TypeScript Strict Null Check in State Machine',
    mode: 'feature',
    language: 'typescript',
    difficulty: 'Medium',
    estimatedTime: '25m',
    description: 'Enforce exhaustive pattern matching and strict type narrowing for a distributed consensus state machine.',
    instructions: [
      'Inspect stateMachine.ts.',
      'Implement transition reducer using discriminated unions.',
      'Ensure never type assertion for default case.'
    ],
    initialFiles: [
      {
        id: 'ts-1',
        name: 'stateMachine.ts',
        path: 'src/stateMachine.ts',
        language: 'typescript',
        content: `export type NodeState = 
  | { status: 'idle'; timestamp: number }
  | { status: 'candidate'; term: number; votes: number }
  | { status: 'leader'; term: number; heartbeatInterval: number }
  | { status: 'follower'; term: number; leaderId: string };

export type Action =
  | { type: 'START_ELECTION' }
  | { type: 'RECEIVE_VOTE' }
  | { type: 'HEARTBEAT_TIMEOUT' }
  | { type: 'LEADER_ELECTED'; leaderId: string };

export function transition(current: NodeState, action: Action): NodeState {
  switch (current.status) {
    case 'idle':
      if (action.type === 'START_ELECTION') {
        return { status: 'candidate', term: 1, votes: 1 };
      }
      return current;

    case 'candidate':
      if (action.type === 'RECEIVE_VOTE') {
        const votes = current.votes + 1;
        if (votes >= 3) {
          return { status: 'leader', term: current.term, heartbeatInterval: 150 };
        }
        return { ...current, votes };
      }
      if (action.type === 'LEADER_ELECTED') {
        return { status: 'follower', term: current.term, leaderId: action.leaderId };
      }
      return current;

    case 'leader':
    case 'follower':
      return current;

    default:
      const _exhaustive: never = current;
      return _exhaustive;
  }
}

// Quick validation
const init: NodeState = { status: 'idle', timestamp: Date.now() };
const next = transition(init, { type: 'START_ELECTION' });
console.log("New state:", next.status);
`
      }
    ],
    testCases: [
      {
        id: 'ts-tc-1',
        name: 'Idle to Candidate transition',
        input: 'START_ELECTION',
        expectedOutput: 'candidate',
        isHidden: false,
        description: 'START_ELECTION action changes status to candidate.'
      },
      {
        id: 'ts-tc-2',
        name: 'Candidate achieves majority votes',
        input: 'MAJORITY_VOTES',
        expectedOutput: 'leader',
        isHidden: false,
        description: 'Candidate transitions to leader upon receiving 3 votes.'
      }
    ],
    solutionHints: [
      'Check TypeScript switch statement exhaustiveness.',
      'Ensure all action types for candidate are handled.'
    ]
  }
];

