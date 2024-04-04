#!/usr/bin/python3
"""
inherits from BaseCaching and is a caching system
"""


from threading import RLock
BaseCaching = __import__('base_caching').BaseCaching


class MRUCache(BaseCaching):
    """
    class that inherits from BaseCaching and is a caching system
    """


    def __init__(self):
        """
        Instantiation method, sets instance attributes
        """

        super().__init__()
        self.__keys = []
        self.__rlock = RLock()

    def put(self, key, item):
        """
        Add an item in the cache
        """
        if key is not None and item is not None:
            _key = self._balance(key)
            with self.__rlock:
                self.cache_data.update({key: item})
            if _key is not None:
                print('DISCARD: {}'.format(_key))

    def get(self, key):
        """
        Get an item by key
        """
        with self.__rlock:
            value = self.cache_data.get(key, None)
            if key in self.__keys:
                self._balance(key)
        return value

    def _balance(self, keyIn):
        """
        Removes the earliest item from the cache at MAX size
        """
        _key = None
        with self.__rlock:
            keyLength = len(self.__keys)
            if keyIn not in self.__keys:
                if len(self.cache_data) == BaseCaching.MAX_ITEMS:
                    _key = self.__keys.pop(keyLength - 1)
                    self.cache_data.pop(_key)
            else:
                self.__keys.remove(keyIn)
            self.__keys.insert(keyLength, keyIn)
        return _key
