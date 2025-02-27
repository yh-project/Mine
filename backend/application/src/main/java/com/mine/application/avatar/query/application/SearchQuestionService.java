package com.mine.application.avatar.query.application;

import com.mine.application.avatar.query.domain.QuestionData;
import com.mine.application.avatar.query.domain.QuestionDataRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


@RequiredArgsConstructor
@Service
public class SearchQuestionService {
    private final QuestionDataRepository questionDataRepository;


    @Transactional(readOnly = true)
    public List<QuestionDto> findAllForClient() {
        return findAll().stream().map(data -> new QuestionDto(data, "아바타의 ", " 무엇인가요?")).toList();
    }

    @Transactional(readOnly = true)
    public List<QuestionData> findAll() {
        return questionDataRepository.queryAll();
    }

}
