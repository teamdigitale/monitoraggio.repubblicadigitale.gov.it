<?php

namespace Drupal\notifications\Controller;

use Exception;
use Drupal\user\Entity\User;
use Drupal\core\Utility\EnvController;
use Drupal\core\Controller\CacheController;
use Drupal\core\Utility\TaxonomyController;

class NotificationsController
{
    public static function sendNotification($entity, $senderId, $receiverId, $type, $reason = null, $contentAuthorId = null)
    {
        $messages = \Drupal::config('notifications_messages.config');

        if (empty($entity)) {
            throw new Exception('Entity is not setted');
        }

        if (empty($type) || empty($messages->get($type))) {
            throw new Exception('Error in type');
        }

        $user = User::load($senderId);
        if (empty($user)) {
            throw new Exception('Error in user load in notification create.');
        }

        $senderUserName = $user->getAccountName();

        $contentAuthorUserName = '';
        if(!empty($contentAuthorId)){
            $contentAuthor = User::load($contentAuthorId);
            if (empty($contentAuthor)) {
                throw new Exception('Error in content author load in notification create.');
            }
            $contentAuthorUserName = '{contentAuthorId: ' . $contentAuthor->getAccountName() . '}' ;
        }

        $variables = [
            "title" => $entity->getTitle(),
            "reason" => $reason ?? '',
            "content_author" => $contentAuthorUserName
        ];

        $messageContent = '{userId: ' . $senderUserName . '} ' . $messages->get($type);

        foreach ($variables as $key => $value) {
            $messageContent = str_replace('{' . strtoupper($key) . '}', $value, $messageContent);
        }

        $notificationService = \Drupal::service('notifications_widget.logger');
        $message = [
            'id' => $entity->id(),
            "bundle" => $entity->bundle(),
            'content' => $messageContent,
            'content_link' => 'users-list'
        ];

        $notificationService->logNotification($message, $type, $entity, $receiverId);
        CacheController::resetViewCache('user_notifications');
    }

    public static function sendMultipleNotifications($entity, $senderId, array $receiverIds, $type, $reason = null, $contentAuthorId = null)
    {
        if (empty($entity)) {
            throw new Exception('Entity is not setted.');
        }

        if (empty($receiverIds)) {
            throw new Exception('No receiver ids.');
        }

        foreach ($receiverIds as $receiverId) {
            self::sendNotification($entity, $senderId, $receiverId, $type, $reason, $contentAuthorId);
        }
    }

    public static function setNotificationStatus($notificationId, $status)
    {
        $query = \Drupal::database()->select('notifications', 'n');
        $query->fields('n', ['id']);
        $query->condition('n.id', $notificationId);

        if (empty($query->execute()->fetchAll())) {
            throw new Exception('Invalid notification id.');
        }

        $query = \Drupal::database()->update('notifications')
            ->fields([
                'status' => $status
            ]);
        $query->condition('id', $notificationId);

        if ($query->execute() != 1) {
            throw new Exception('Error in notificaiton update.');
        }

        CacheController::resetViewCache('user_notifications');

        return true;
    }

    public static function getNotificationUserIds(){
        $termId = TaxonomyController::termIdByName('user_roles', EnvController::getValues('USER_ROLE_FOR_NOTIFICATION'));
        if(empty($termId)){
            throw new Exception('Notification user roles does not exist.');
        }
        
        $notificationUsers = \Drupal::entityTypeManager()
        ->getStorage('user')
        ->loadByProperties([
          'field_roles' => [$termId]
        ]);

        $userIds = [];
        foreach($notificationUsers as $notificationUser){
            $userIds[] = $notificationUser->id();
        }
        
        return $userIds;
    }
}
